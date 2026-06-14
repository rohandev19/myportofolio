/**
 * API Response Utilities
 *
 * Standardized API response helpers with security headers.
 * Ensures consistent response format and security across all API routes.
 */

import { NextResponse } from "next/server";

/**
 * Security headers applied to all API responses
 */
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
} as const;

/**
 * Standard error codes for API responses
 */
export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  HONEYPOT_DETECTED: "HONEYPOT_DETECTED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Create a secure API response with security headers
 *
 * @example
 * ```typescript
 * return secureApiResponse({ success: true, message: "Email sent" }, 200);
 * ```
 *
 * @param data - Response body data
 * @param status - HTTP status code (default: 200)
 * @param extraHeaders - Additional headers to merge
 * @returns NextResponse with security headers
 */
export function secureApiResponse<T>(
  data: T,
  status: number = 200,
  extraHeaders?: Record<string, string>
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

/**
 * Create a standardized error response
 *
 * @example
 * ```typescript
 * return errorResponse("Invalid email format", "VALIDATION_ERROR", 400);
 * ```
 *
 * @param message - Human-readable error message
 * @param code - Machine-readable error code
 * @param status - HTTP status code (default: 400)
 * @param retryAfter - Optional Retry-After header value in seconds
 * @returns NextResponse with error body and security headers
 */
export function errorResponse(
  message: string,
  code: ErrorCode,
  status: number = 400,
  retryAfter?: number
): NextResponse {
  const extraHeaders: Record<string, string> = {};

  if (retryAfter !== undefined) {
    extraHeaders["Retry-After"] = String(retryAfter);
  }

  return secureApiResponse(
    {
      success: false,
      error: {
        message,
        code,
      },
    },
    status,
    extraHeaders
  );
}

/**
 * Create a success response with consistent format
 *
 * @param data - Response payload
 * @param message - Optional success message
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with success body and security headers
 */
export function successResponse<T>(data: T, message?: string, status: number = 200): NextResponse {
  return secureApiResponse(
    {
      success: true,
      ...(message && { message }),
      data,
    },
    status
  );
}
