export const BOOKING_TYPE_IDS = [
  "discovery-call",
  "dos-website-demo",
  "micah-created-booking",
  "service-booking",
  "quote-site-visit",
  "follow-up-reminder",
] as const;

export const BOOKING_STATUSES = [
  "requested",
  "confirmed",
  "reschedule-requested",
  "cancelled",
  "completed",
  "no-show",
] as const;

export const SOURCE_SYSTEMS = [
  "micah",
  "dos-website",
  "doslead",
  "guestmate",
  "quoteos",
  "agentmate",
  "manual",
] as const;

export type BookingTypeId = (typeof BOOKING_TYPE_IDS)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type SourceSystem = (typeof SOURCE_SYSTEMS)[number];

export type BookingTypeDefinition = {
  id: BookingTypeId;
  label: string;
  defaultDurationMinutes: number;
  nextAction: string;
};

export type ContactRecord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: SourceSystem;
  organization: string;
  notes: string;
  createdAt: string;
};

export type NotificationChannel = "email" | "sms" | "internal";
export type NotificationStage =
  | "internal-booking-email"
  | "customer-confirmation-email"
  | "sms-reminder-24h"
  | "sms-reminder-2h"
  | "reschedule-email"
  | "cancellation-email";
export type NotificationStatus = "pending" | "sent" | "failed" | "skipped";

export type NotificationEvent = {
  id: string;
  bookingId: string;
  channel: NotificationChannel;
  stage: NotificationStage;
  status: NotificationStatus;
  scheduledFor: string;
  failureReason?: string;
};

export type NextAction = {
  label: string;
  dueAt: string;
  ownerRole: "dos-internal" | "business-operator" | "product-workflow";
};

export type OperationalBookingInput = {
  title?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  organization?: string;
  serviceType?: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  notes?: string;
  bookingType?: BookingTypeId;
  status?: BookingStatus;
  source?: SourceSystem;
  timezone?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type OperationalBooking = Required<
  Pick<OperationalBookingInput, "date" | "time">
> &
  Omit<OperationalBookingInput, "date" | "time" | "endDate" | "metadata"> & {
    id: string;
    title: string;
    customerName: string;
    phone: string;
    email: string;
    organization: string;
    serviceType: string;
    endDate: string;
    endTime: string;
    notes: string;
    bookingType: BookingTypeId;
    status: BookingStatus;
    source: SourceSystem;
    timezone: string;
    contactId: string;
    nextAction: NextAction;
    notificationEvents: NotificationEvent[];
    metadata: Record<string, string | number | boolean | null>;
    createdAt: string;
    updatedAt: string;
  };

export const bookingTypeDefinitions: Record<BookingTypeId, BookingTypeDefinition> = {
  "discovery-call": {
    id: "discovery-call",
    label: "Discovery Call",
    defaultDurationMinutes: 30,
    nextAction: "Prepare discovery notes",
  },
  "dos-website-demo": {
    id: "dos-website-demo",
    label: "DOS Website Demo",
    defaultDurationMinutes: 45,
    nextAction: "Prepare demo path",
  },
  "micah-created-booking": {
    id: "micah-created-booking",
    label: "Micah-Created Booking",
    defaultDurationMinutes: 60,
    nextAction: "Review Micah intake",
  },
  "service-booking": {
    id: "service-booking",
    label: "Service Booking",
    defaultDurationMinutes: 60,
    nextAction: "Confirm service details",
  },
  "quote-site-visit": {
    id: "quote-site-visit",
    label: "Quote / Site Visit",
    defaultDurationMinutes: 60,
    nextAction: "Prepare quote follow-up",
  },
  "follow-up-reminder": {
    id: "follow-up-reminder",
    label: "Follow-Up Reminder",
    defaultDurationMinutes: 15,
    nextAction: "Complete follow-up",
  },
};

export const sourceLabels: Record<SourceSystem, string> = {
  micah: "Micah",
  "dos-website": "DOS Website",
  doslead: "DOSLead",
  guestmate: "GuestMate",
  quoteos: "QuoteOS",
  agentmate: "AgentMate",
  manual: "Manual",
};

export const statusLabels: Record<BookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  "reschedule-requested": "Reschedule Requested",
  cancelled: "Cancelled",
  completed: "Completed",
  "no-show": "No Show",
};

export const notificationStageLabels: Record<NotificationStage, string> = {
  "internal-booking-email": "Internal booking email",
  "customer-confirmation-email": "Customer confirmation email",
  "sms-reminder-24h": "SMS reminder 24 hours before",
  "sms-reminder-2h": "SMS reminder 2 hours before",
  "reschedule-email": "Reschedule email",
  "cancellation-email": "Cancellation email",
};

export function toDateInput(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function addMinutesToTime(time: string, minutesToAdd: number) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toTimeString().slice(0, 5);
}

export function inferBookingType(input: Pick<OperationalBookingInput, "source" | "serviceType" | "bookingType">): BookingTypeId {
  if (input.bookingType) {
    return input.bookingType;
  }
  const service = input.serviceType?.toLowerCase() ?? "";
  if (input.source === "micah") {
    return "micah-created-booking";
  }
  if (service.includes("demo")) {
    return "dos-website-demo";
  }
  if (service.includes("quote") || service.includes("site visit") || service.includes("inspection")) {
    return "quote-site-visit";
  }
  if (service.includes("follow")) {
    return "follow-up-reminder";
  }
  return "service-booking";
}

export function hasSlotConflict(
  input: Pick<OperationalBookingInput, "date" | "time">,
  existingBookings: Array<Pick<OperationalBooking, "date" | "time" | "status">>,
) {
  return existingBookings.some(
    (booking) =>
      booking.date === input.date &&
      booking.time === input.time &&
      booking.status !== "cancelled" &&
      booking.status !== "completed" &&
      booking.status !== "no-show",
  );
}

export function resolveBookingStatus(
  input: Pick<OperationalBookingInput, "status" | "date" | "time">,
  existingBookings: Array<Pick<OperationalBooking, "date" | "time" | "status">>,
): BookingStatus {
  if (input.status) {
    return input.status;
  }
  return hasSlotConflict(input, existingBookings) ? "requested" : "confirmed";
}

export function createContactRecord(input: OperationalBookingInput, id = crypto.randomUUID()): ContactRecord {
  return {
    id,
    name: input.customerName?.trim() || "Unknown Customer",
    phone: input.phone?.trim() || "",
    email: input.email?.trim() || "",
    source: input.source ?? "manual",
    organization: input.organization?.trim() || "",
    notes: input.notes?.trim() || "",
    createdAt: new Date().toISOString(),
  };
}

export function buildNextAction(bookingType: BookingTypeId, date: string, time: string, source: SourceSystem): NextAction {
  const ownerRole: NextAction["ownerRole"] = source === "dos-website" || source === "doslead" ? "dos-internal" : "business-operator";
  return {
    label: bookingTypeDefinitions[bookingType].nextAction,
    dueAt: `${date}T${time}:00`,
    ownerRole,
  };
}

export function buildNotificationEvents(
  bookingId: string,
  date: string,
  time: string,
  hasEmail: boolean,
  hasPhone: boolean,
) {
  const bookingDate = new Date(`${date}T${time}:00`);
  const reminder24 = new Date(bookingDate);
  reminder24.setHours(reminder24.getHours() - 24);
  const reminder2 = new Date(bookingDate);
  reminder2.setHours(reminder2.getHours() - 2);
  const now = new Date().toISOString();
  const makeEvent = (
    channel: NotificationChannel,
    stage: NotificationStage,
    scheduledFor: string,
    status: NotificationStatus,
    failureReason?: string,
  ): NotificationEvent => ({
    id: crypto.randomUUID(),
    bookingId,
    channel,
    stage,
    status,
    scheduledFor,
    failureReason,
  });

  return [
    makeEvent("internal", "internal-booking-email", now, "pending"),
    makeEvent("email", "customer-confirmation-email", now, hasEmail ? "pending" : "skipped", hasEmail ? undefined : "No customer email captured"),
    makeEvent("sms", "sms-reminder-24h", reminder24.toISOString(), hasPhone ? "pending" : "skipped", hasPhone ? undefined : "No customer phone captured"),
    makeEvent("sms", "sms-reminder-2h", reminder2.toISOString(), hasPhone ? "pending" : "skipped", hasPhone ? undefined : "No customer phone captured"),
  ];
}

export function buildLifecycleNotificationEvent(
  bookingId: string,
  stage: Extract<NotificationStage, "reschedule-email" | "cancellation-email">,
  hasEmail: boolean,
): NotificationEvent {
  return {
    id: crypto.randomUUID(),
    bookingId,
    channel: "email",
    stage,
    status: hasEmail ? "sent" : "skipped",
    scheduledFor: new Date().toISOString(),
    failureReason: hasEmail ? undefined : "No customer email captured",
  };
}

export function createOperationalBooking(
  input: OperationalBookingInput,
  existingBookings: Array<Pick<OperationalBooking, "date" | "time" | "status">> = [],
  id = crypto.randomUUID(),
): OperationalBooking {
  const source = input.source ?? "manual";
  const bookingType = inferBookingType(input);
  const duration = bookingTypeDefinitions[bookingType].defaultDurationMinutes;
  const status = resolveBookingStatus(input, existingBookings);
  const contact = createContactRecord(input);
  const now = new Date().toISOString();

  return {
    id,
    title: input.title?.trim() || bookingTypeDefinitions[bookingType].label,
    customerName: contact.name,
    phone: contact.phone,
    email: contact.email,
    organization: contact.organization,
    serviceType: input.serviceType?.trim() || bookingTypeDefinitions[bookingType].label,
    date: input.date,
    time: input.time,
    endDate: input.endDate || input.date,
    endTime: input.endTime || addMinutesToTime(input.time, duration),
    notes: input.notes?.trim() || "",
    bookingType,
    status,
    source,
    timezone: input.timezone || "Australia/Sydney",
    contactId: contact.id,
    nextAction: buildNextAction(bookingType, input.date, input.time, source),
    notificationEvents: buildNotificationEvents(id, input.date, input.time, Boolean(contact.email), Boolean(contact.phone)),
    metadata: input.metadata ?? {},
    createdAt: now,
    updatedAt: now,
  };
}
