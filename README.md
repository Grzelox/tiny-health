# Tiny Health

<div align="center">
  <img src="public/landing.png" alt="Tiny Health dashboard" width="800"/>
  <img src="public/dashboard.png" alt="Tiny Health features" width="800"/>
</div>

## About

Tiny Health is a small web app for tracking pet health records (visits, notes, weight, and media) in one place.

## Quickstart

### Run locally

```bash
npm install
cp .env.example .env.local

# Generate Prisma client
npm run generate

# Apply migrations to your database
npx prisma migrate dev

# Start the dev server
npm run dev
```

Set the required environment variables in `.env.local` (database, Clerk, UploadThing).

App runs at `http://localhost:3000`.

### Build

```bash
npm run build
npm run start
```

## Architecture

- **Framework**: Next.js App Router (`src/app`) with server and client components.
- **API**: Route handlers under `src/app/api` (including versioned endpoints under `src/app/api/v1`).
- **UI**: Reusable React components in `src/components` (Tailwind CSS styles in `src/app/globals.css`).
- **Data access**: Prisma schema in `prisma/schema.prisma`, Prisma client in `src/utils/prisma.ts`.
- **Auth**: Clerk integration (middleware and provider wiring in `src/middleware.ts` and `src/app/providers.tsx`).
- **Client data fetching**: React Query hooks and helpers in `src/hooks`.
- **Uploads/media**: UploadThing integration in `src/app/api/uploadthing` and `src/utils/uploadthing.ts`.
