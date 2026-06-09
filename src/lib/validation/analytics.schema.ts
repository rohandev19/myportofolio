/**
 * Analytics Event Validation Schema
 *
 * Zod schema for privacy-first analytics events.
 */

import { z } from "zod";

const analyticsEventTypeSchema = z.enum(["page_view", "web_vital", "feature_use", "search"]);

export const analyticsEventSchema = z.object({
  type: analyticsEventTypeSchema,
  sessionId: z.string().length(64), // SHA-256 hash hex string
  timestamp: z.number().positive(),
  path: z.string().min(1),
  metadata: z.record(z.string(), z.union([z.string(), z.number()])),
});

export const analyticsBatchSchema = z.object({
  events: z.array(analyticsEventSchema).min(1).max(100),
  sessionId: z.string().length(64),
});

export type AnalyticsEventValidated = z.infer<typeof analyticsEventSchema>;
export type AnalyticsBatchValidated = z.infer<typeof analyticsBatchSchema>;
