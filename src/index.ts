import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { calendarHandler } from '@/calendar';

export type Bindings = {
  DB: D1Database;
  CACHE_TIME: number;
  GOOGLE_CALENDAR_ID: string;
  GOOGLE_CALENDAR_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET'],
  allowHeaders: ['*'],
}));

app.get('/calendar', calendarHandler);
app.get('*', (c) => c.json({ error: 'Not Found' }, 404));

export default app;
