import { NextResponse } from "next/server";
import { createOperationalBooking, type OperationalBookingInput } from "@/lib/dosCalendarCore";
import { persistOperationalBooking } from "@/lib/dosCalendarRepository";

type MicahBookingPayload = {
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    organization?: string;
  };
  request?: {
    serviceType?: string;
    preferredDate?: string;
    preferredTime?: string;
    preferredEndDate?: string;
    preferredEndTime?: string;
    notes?: string;
  };
  sourceProduct?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

function toBookingInput(payload: MicahBookingPayload): OperationalBookingInput | null {
  const date = payload.request?.preferredDate;
  const time = payload.request?.preferredTime;

  if (!date || !time) {
    return null;
  }

  return {
    customerName: payload.customer?.name,
    phone: payload.customer?.phone,
    email: payload.customer?.email,
    organization: payload.customer?.organization,
    serviceType: payload.request?.serviceType || "Micah-created booking",
    date,
    time,
    endDate: payload.request?.preferredEndDate || date,
    endTime: payload.request?.preferredEndTime,
    notes: payload.request?.notes,
    source: "micah",
    bookingType: "micah-created-booking",
    metadata: {
      sourceProduct: payload.sourceProduct ?? "micah",
      ...(payload.metadata ?? {}),
    },
  };
}

export async function POST(request: Request) {
  let body: MicahBookingPayload;

  try {
    body = (await request.json()) as MicahBookingPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const input = toBookingInput(body);

  if (!input) {
    return NextResponse.json(
      { error: "Micah booking requires request.preferredDate and request.preferredTime" },
      { status: 400 },
    );
  }

  const booking = createOperationalBooking(input);

  try {
    const persistence = await persistOperationalBooking(booking);
    return NextResponse.json({
      bookingId: booking.id,
      status: booking.status,
      nextAction: booking.nextAction,
      booking,
      persistence,
    });
  } catch (error) {
    return NextResponse.json(
      {
        bookingId: booking.id,
        status: booking.status,
        nextAction: booking.nextAction,
        booking,
        persistence: {
          persisted: false,
          reason: error instanceof Error ? error.message : "Unknown persistence failure",
        },
      },
      { status: 202 },
    );
  }
}
