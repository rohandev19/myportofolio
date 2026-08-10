/**
 * Contact Form API Route
 *
 * POST handler for contact form submissions.
 * Includes Zod validation, honeypot detection, rate limiting,
 * input sanitization, and secure API responses.
 */

import { contactRequestSchema } from "@/lib/validation/contact.schema";
import { sanitizePlainText } from "@/lib/sanitize";
import { rateLimiters } from "@/lib/rate-limit/sliding-window";
import { errorResponse, successResponse, ErrorCodes } from "@/lib/utils/api-response";

/**
 * Extract client IP from request headers
 */
function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    // 1. Rate limiting — 3 requests per hour per IP
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiters.contact.checkRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      return errorResponse(
        "Too many requests. Please try again later.",
        ErrorCodes.RATE_LIMIT_EXCEEDED,
        429,
        rateLimitResult.retryAfter
      );
    }

    // 2. Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body", ErrorCodes.BAD_REQUEST, 400);
    }

    // 3. Validate with Zod schema
    const validation = contactRequestSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return errorResponse(
        firstError?.message || "Validation failed",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const { name, email, subject, message, honeypot } = validation.data;

    // 4. Honeypot check — bots fill hidden fields
    if (honeypot && honeypot.length > 0) {
      // Silently accept but don't process (don't reveal detection)
      return successResponse({ sent: true }, "Message sent successfully");
    }

    // 5. Sanitize inputs
    const sanitizedData = {
      name: sanitizePlainText(name),
      email: sanitizePlainText(email),
      subject: subject ? sanitizePlainText(subject) : undefined,
      message: sanitizePlainText(message),
    };

    // 6. Send email via Web3Forms or Resend
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (accessKey) {
      const formPayload = {
        access_key: accessKey,
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject || `Portfolio Contact from ${sanitizedData.name}`,
        message: sanitizedData.message,
        from_name: "Portfolio Contact Form",
      };

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const emailResponse = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formPayload),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const emailResult = await emailResponse.json();

        if (!emailResult.success) {
          console.error("Email send failed:", emailResult);
          return errorResponse(
            "Failed to send message. Please try again.",
            ErrorCodes.INTERNAL_ERROR,
            500
          );
        }
      } catch (emailError) {
        console.error("Email service unreachable or timed out:", emailError);
        return errorResponse(
          "Failed to send message. Please try again later.",
          ErrorCodes.INTERNAL_ERROR,
          502
        );
      }
    } else {
      // Log for development — no email service configured
      console.log("[Contact Form] No email service configured. Submission data:", {
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        messageLength: sanitizedData.message.length,
      });
    }

    // 7. Return success
    return successResponse(
      {
        sent: true,
        remaining: rateLimitResult.remaining,
      },
      "Message sent successfully"
    );
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error);
    return errorResponse("An unexpected error occurred", ErrorCodes.INTERNAL_ERROR, 500);
  }
}
