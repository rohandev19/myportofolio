/**
 * Property 14: Email Validation Correctness
 * Property 15: Message Length Boundary Invariant
 *
 * Validates: Requirements 11.4, 11.6
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { contactFormSchema } from "@/lib/validation/contact.schema";

describe("Property 14: Email Validation Correctness", () => {
  it("should accept valid RFC 5322 emails", () => {
    fc.assert(
      fc.property(fc.emailAddress(), (email) => {
        const result = contactFormSchema.safeParse({
          name: "Test User",
          email,
          message: "This is a test message with sufficient length.",
          honeypot: "",
        });

        expect(result.success).toBe(true);
      }),
      { numRuns: 200 }
    );
  });

  it("should reject invalid email formats", () => {
    const invalidEmails = [
      "",
      "notanemail",
      "@example.com",
      "user@",
      "user @example.com",
      "user..name@example.com",
      "user@.com",
      "user@example",
    ];

    invalidEmails.forEach((email) => {
      const result = contactFormSchema.safeParse({
        name: "Test User",
        email,
        message: "This is a test message with sufficient length.",
        honeypot: "",
      });

      expect(result.success, `Should reject: ${email}`).toBe(false);
    });
  });

  it("should handle edge case emails correctly", () => {
    const edgeCaseEmails = [
      "test+tag@example.com", // Plus addressing
      "user.name@example.com", // Dots in local part
      "user_name@example.co.uk", // Multiple TLDs
      "user123@sub.example.com", // Subdomain
    ];

    edgeCaseEmails.forEach((email) => {
      const result = contactFormSchema.safeParse({
        name: "Test User",
        email,
        message: "This is a test message with sufficient length.",
        honeypot: "",
      });

      expect(result.success, `Should accept: ${email}`).toBe(true);
    });
  });
});

describe("Property 15: Message Length Boundary Invariant", () => {
  it("should accept messages with length in [10, 1000]", () => {
    fc.assert(
      fc.property(fc.integer({ min: 10, max: 1000 }), (length) => {
        const message = "a".repeat(length);

        const result = contactFormSchema.safeParse({
          name: "Test User",
          email: "test@example.com",
          message,
          honeypot: "",
        });

        expect(result.success, `Length ${length} should be valid`).toBe(true);

        if (result.success) {
          expect(result.data.message.length).toBe(length);
        }
      }),
      { numRuns: 200 }
    );
  });

  it("should reject messages with length < 10", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 9 }), (length) => {
        const message = "a".repeat(length);

        const result = contactFormSchema.safeParse({
          name: "Test User",
          email: "test@example.com",
          message,
          honeypot: "",
        });

        expect(result.success, `Length ${length} should be invalid`).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it("should reject messages with length > 1000", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1001, max: 1500 }), (length) => {
        const message = "a".repeat(length);

        const result = contactFormSchema.safeParse({
          name: "Test User",
          email: "test@example.com",
          message,
          honeypot: "",
        });

        expect(result.success, `Length ${length} should be invalid`).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it("should validate exact boundaries (10 and 1000)", () => {
    // Minimum boundary
    const minResult = contactFormSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      message: "a".repeat(10),
      honeypot: "",
    });
    expect(minResult.success).toBe(true);

    // Maximum boundary
    const maxResult = contactFormSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      message: "a".repeat(1000),
      honeypot: "",
    });
    expect(maxResult.success).toBe(true);

    // Just below minimum
    const belowMinResult = contactFormSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      message: "a".repeat(9),
      honeypot: "",
    });
    expect(belowMinResult.success).toBe(false);

    // Just above maximum
    const aboveMaxResult = contactFormSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      message: "a".repeat(1001),
      honeypot: "",
    });
    expect(aboveMaxResult.success).toBe(false);
  });
});

describe("Additional Validation Tests", () => {
  it("should reject forms with non-empty honeypot", () => {
    const result = contactFormSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      message: "This is a valid message.",
      honeypot: "bot filled this",
    });

    expect(result.success).toBe(false);
  });

  it("should trim whitespace from name and message", () => {
    const result = contactFormSchema.safeParse({
      name: "  Test User  ",
      email: "test@example.com",
      message: "  This is a test message with sufficient length.  ",
      honeypot: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Test User");
      expect(result.data.message).toBe("This is a test message with sufficient length.");
    }
  });

  it("should enforce name length constraints", () => {
    // Too short
    const tooShort = contactFormSchema.safeParse({
      name: "A",
      email: "test@example.com",
      message: "Valid message here.",
      honeypot: "",
    });
    expect(tooShort.success).toBe(false);

    // Too long
    const tooLong = contactFormSchema.safeParse({
      name: "A".repeat(101),
      email: "test@example.com",
      message: "Valid message here.",
      honeypot: "",
    });
    expect(tooLong.success).toBe(false);

    // Just right
    const justRight = contactFormSchema.safeParse({
      name: "Valid Name",
      email: "test@example.com",
      message: "Valid message here.",
      honeypot: "",
    });
    expect(justRight.success).toBe(true);
  });
});
