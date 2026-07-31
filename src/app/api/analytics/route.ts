import { NextResponse } from "next";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // In a real application, you would save these events to a database
    // or forward them to an external analytics service.
    console.log(`Received ${events.length} analytics events`);

    return NextResponse.json({ success: true, count: events.length });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to process analytics" }, { status: 500 });
  }
}
