import { Context } from 'hono';
import { Bindings } from '@/index';
import { CalendarData, CalendarEvent } from '@/types';

export const calendarHandler = async (c: Context<{ Bindings: Bindings }>) => {
  const CACHE_TIME = c.env.CACHE_TIME || 5 * 60;
  const GOOGLE_CALENDAR_ID = c.env.GOOGLE_CALENDAR_ID;
  const API_URL = `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?key=${c.env.GOOGLE_CALENDAR_API_KEY}`;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  };

  try {
    const now = Date.now();

    const cached = await c.env.DB.prepare(
      'SELECT data, timestamp FROM calendar_cache WHERE id = ?')
      .bind(0)
      .first<{ data: string; timestamp: number }>()
      .then(result => result ? {
        data: JSON.parse(result.data) as CalendarData,
        timestamp: result.timestamp
      } : null);

    if (cached?.data && (now - cached.timestamp) < (CACHE_TIME * 1_000)) {
      return new Response(
        JSON.stringify(cached.data), 
        { status: 200, headers }
      );
    }

    const apiResponse = await fetch(API_URL);

    if (!apiResponse.ok) {
      console.error('API Error:', apiResponse.status, apiResponse.statusText);
      return new Response(
        JSON.stringify({ ...(cached?.data || {}), error: true }), 
        { status: 500, headers }
      );
    }

    console.log('API Response:', apiResponse);

    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ ...(cached?.data || {}), error: true }), 
        { status: 500, headers }
      );
    }

    const fullData = await apiResponse.json() as CalendarData & { [key: string]: any };

    const reducedData: CalendarData = {
      summary: fullData.summary,
      description: fullData.description,
      updated: fullData.updated,
      timeZone: fullData.timeZone,
      items: (fullData.items || []).map((item: CalendarEvent & { [key: string]: any }) => ({
        created: item.created,
        updated: item.updated,
        summary: item.summary,
        description: item.description,
        location: item.location,
        start: item.start,
        end: item.end,
      })).sort((a: CalendarEvent, b: CalendarEvent) => {
        const dateA = new Date(a.start.dateTime || a.start.date || '').getTime();
        const dateB = new Date(b.start.dateTime || b.start.date || '').getTime();
        return dateA - dateB;
      }).map((item: CalendarEvent, index: number) => ({ ...item, index })),
    };

    c.executionCtx.waitUntil(
      c.env.DB.prepare(
        'INSERT OR REPLACE INTO calendar_cache (id, data, timestamp) VALUES (?, ?, ?)')
        .bind(0, JSON.stringify(reducedData), now)
        .run()
    );

    return new Response(JSON.stringify(reducedData), { status: 200, headers });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers });
  }
};
