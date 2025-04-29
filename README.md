# KEmunITa API

API backend for [KEmunITa Web](https://github.com/lukasondrejka/kemunita-web), serving event data fetched from Google Calendar with caching.

Built with [Hono](https://hono.dev/), deployed on [Cloudflare Workers](https://workers.cloudflare.com/), and utilizing [Cloudflare D1](https://developers.cloudflare.com/d1/) for storage.

## Development Setup

Follow these steps to set up the project locally:

1. Clone the Repository

    ```bash
    git clone https://github.com/lukasondrejka/kemunita-api.git
    cd kemunita-api
    ```

2. Install Dependencies

    ```bash
    npm install
    ```

3. Configure Environment Variables

    Set the environment variables in the `wrangler.toml` file:

    - `CACHE_TIME`:  
    Cache duration in seconds.
    
    - `GOOGLE_CALENDAR_ID`:  
    The Google Calendar ID to fetch events from.
    
    - `GOOGLE_CALENDAR_API_KEY`:  
    API key for accessing the [Google Calendar API](https://developers.google.com/calendar).

4. Run Migrations and Start the Development Server

    ```bash
    npm run dev-migrate
    npm run dev
    ```

## Resources

- [Hono](https://hono.dev/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Google Calendar API](https://developers.google.com/calendar)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
