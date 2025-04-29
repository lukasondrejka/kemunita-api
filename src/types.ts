export interface CalendarData {
  summary: string;
  description?: string;
  updated: string; // ISO timestamp
  timeZone: string;
  items: CalendarEvent[];
}

export interface CalendarEvent {
  index: number;
  created: string; // ISO timestamp
  updated: string; // ISO timestamp
  summary: string;
  description?: string;
  location?: string;
  start: EventDateTime;
  end?: EventDateTime;
}

export interface EventDateTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}
