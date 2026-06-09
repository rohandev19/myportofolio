/**
 * Contact Form Validation Schema
 *
 * Zod schema for contact form with RFC 5322 email validation,
 * length constraints, and honeypot bot detection.
 */

import { z } from "zod";

// RFC 5322 compliant email regex
// Supports special characters in local part (before @)
// Allows: letters, numbers, and special chars .!#$%&'*+/=?^_`{|}~-
// Domain must have valid structure with TLD
const RFC5322_EMAIL =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  email: z.string().regex(RFC5322_EMAIL, "Invalid email format"),

  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject cannot exceed 200 characters")
    .trim()
    .optional(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters")
    .trim(),

  // Honeypot field - must be empty (bots fill this)
  honeypot: z.string().max(0, "Invalid submission"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Server-side validation for API route
export const contactRequestSchema = contactFormSchema.extend({
  // Additional server-side validations can go here
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
