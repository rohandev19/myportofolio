/**
 * Web Vitals API Route
 *
 * Receives Web Vitals metrics from the client.
 * Stores in-memory for MVP (upgradeable to database).
 */

import { NextResponse } from "next/server";

interface VitalPayload {
  name: string;
  value: number;
  rating?: string;
  sessionId?: string;
}

// In-memory store for MVP
const vitalsStore: VitalPayload[] = [];
const MAX_STORE_SIZE = 1000;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VitalPayload | VitalPayload[];

    const vitals = Array.isArray(body) ? body : [body];

    for (const vital of vitals) {
      if (!vital.name || typeof vital.value !== "number") {
        continue;
      }

      vitalsStore.push(vital);

      // Keep store bounded
      if (vitalsStore.length > MAX_STORE_SIZE) {
        vitalsStore.shift();
      }
    }

    return NextResponse.json({ success: true, stored: vitals.length });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    vitals: vitalsStore.slice(-100), // Return last 100
    total: vitalsStore.length,
  });
}
