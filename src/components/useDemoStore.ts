"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { loadDemoState, saveDemoState } from "@/components/calendarStorage";
import type { CalendarEvent, DemoState, DemoTheme, Reminder } from "@/components/calendarTypes";
import { DEFAULT_BUSINESS_NAME, THEME_STORAGE_KEY } from "@/components/calendarTypes";

const defaultSnapshot: DemoState = {
  businessName: DEFAULT_BUSINESS_NAME,
  events: [],
  reminders: [],
  theme: "day",
};

let snapshot: DemoState = defaultSnapshot;
let listeners = new Set<() => void>();
let isInitialized = false;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initDemoStore(fallbackEvents: CalendarEvent[], fallbackReminders: Reminder[]) {
  if (isInitialized) {
    return;
  }
  snapshot = loadDemoState(fallbackEvents, fallbackReminders);
  isInitialized = true;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", snapshot.theme === "night");
  }
}

export function useDemoStore(fallbackEvents: CalendarEvent[], fallbackReminders: Reminder[]) {
  const serverSnapshot = useMemo(
    () => ({
      businessName: DEFAULT_BUSINESS_NAME,
      events: fallbackEvents,
      reminders: fallbackReminders,
      theme: "day" as DemoTheme,
    }),
    [fallbackEvents, fallbackReminders],
  );

  const getClientSnapshot = useCallback(() => {
    if (!isInitialized) {
      initDemoStore(fallbackEvents, fallbackReminders);
    }
    return snapshot;
  }, [fallbackEvents, fallbackReminders]);

  const state = useSyncExternalStore(subscribe, getClientSnapshot, () => serverSnapshot);

  const setBusinessName = useCallback((businessName: string) => {
    snapshot = { ...snapshot, businessName: businessName.trim() || DEFAULT_BUSINESS_NAME };
    saveDemoState({ businessName: snapshot.businessName, events: snapshot.events, reminders: snapshot.reminders });
    emitChange();
  }, []);

  const setEvents = useCallback((updater: CalendarEvent[] | ((current: CalendarEvent[]) => CalendarEvent[])) => {
    const events = typeof updater === "function" ? updater(snapshot.events) : updater;
    snapshot = { ...snapshot, events };
    saveDemoState({ businessName: snapshot.businessName, events: snapshot.events, reminders: snapshot.reminders });
    emitChange();
  }, []);

  const setReminders = useCallback((updater: Reminder[] | ((current: Reminder[]) => Reminder[])) => {
    const reminders = typeof updater === "function" ? updater(snapshot.reminders) : updater;
    snapshot = { ...snapshot, reminders };
    saveDemoState({ businessName: snapshot.businessName, events: snapshot.events, reminders: snapshot.reminders });
    emitChange();
  }, []);

  const setTheme = useCallback((theme: DemoTheme) => {
    snapshot = { ...snapshot, theme };
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "night");
    emitChange();
  }, []);

  return {
    ...state,
    setBusinessName,
    setEvents,
    setReminders,
    setTheme,
  };
}
