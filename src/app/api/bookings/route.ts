import { NextResponse } from "next/server";
import { createOperationalBooking, type OperationalBookingInput } from "@/lib/dosCalendarCore";
import { persistOperationalBooking } from "@/lib/dosCalendarRepository";

function isBookingInput(value: unknown): value is OperationalBookingInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OperationalBookingInput>;
  return typeof candidate.date === "string" && typeof candidate.time === "string";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!isBookingInput(body)) {
    return NextResponse.json({ error: "date and time are required" }, { status: 400 });
  }

  const booking = createOperationalBooking(body);

  try {
    const persistence = await persistOperationalBooking(booking);
    return NextResponse.json({
      booking,
      persistence,
      nextAction: booking.nextAction,
      status: booking.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        booking,
        persistence: {
          persisted: false,
          reason: error instanceof Error ? error.message : "Unknown persistence failure",
        },
        nextAction: booking.nextAction,
        status: booking.status,
      },
      { status: 202 },
    );
  }
}
