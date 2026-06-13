## Tiny Health Repository Guide

### What This App Does

Tiny Health is a pet health tracking app focused primarily on rodents, while also supporting other small pets.

Core user-facing capabilities:
- Create and manage pet profiles.
- Track vet visits and medications.
- Track weight history and visualize it on a chart.
- Store pet notes.
- Upload and browse pet photos.
- Share all owned pets with another Clerk user by email.
- Export pet, visit, and weight data as a ZIP of CSV files.

The UI is mostly in Polish and Clerk is configured with Polish localization.

### Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4-style toolchain (`@tailwindcss/postcss`)
- Prisma 6 with PostgreSQL
- Clerk for authentication
- TanStack React Query for client-side data fetching/cache invalidation
- Jest + Testing Library for tests
- AWS SDK v3 against DigitalOcean Spaces for media storage
- Recharts for weight history charts
- Framer Motion for landing-page animations

### Runtime And Tooling

- Package manager in practice: `npm` (`package-lock.json` is committed)
- Node version: `22.x`
- Path alias: `@/*` -> `src/*`
- TypeScript is currently not strict (`"strict": false`)

Useful scripts:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run test`
- `npm run generate`

### Git And Deployment Workflow

- GitHub repository: `https://github.com/Grzelox/tiny-health`
- Primary branch: `main`
- When working on an issue, create a branch from `main`.
- Name the branch with the issue ID.
- Changes must go through a Pull Request before merging to `main`.
- Treat `main` as production-connected.
- The app is deployed on DigitalOcean.
- The production instance is connected to the `main` branch with autodeploy enabled.
- Approved Pull Requests merged to `main` are automatically deployed to production.
- Deployment config details provided by the user: branch `main`, hash `82ef747`, autodeploy `On`.

Agent implication:
- Be conservative with changes that could affect production behavior.
- Prefer validating meaningful changes locally before suggesting merge readiness.
- Do not merge or push to `main` directly unless the user explicitly asks.

### Important Environment Variables

Primary integrations:
- `DATABASE_URL`
- `DIRECT_URL`
- `SHADOW_DATABASE_URL` (required by `prisma/schema.prisma`, but currently not present in `.env.example`)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `SPACES_ENDPOINT`
- `SPACES_REGION`
- `SPACES_BUCKET`
- `SPACES_ACCESS_KEY_ID`
- `SPACES_SECRET_ACCESS_KEY`
- `SPACES_PUBLIC_BASE_URL`
- `MAX_DB_POOLING_SIZE`

### High-Level Architecture

#### Frontend

- `src/app/page.tsx` is the top-level entry point.
- Logged-out users see the marketing landing page in `src/components/Welcome.tsx`.
- Logged-in users see the dashboard in `src/components/Dashboard.tsx`.
- Pet details live at `src/app/pet/[id]/page.tsx` where `[id]` is actually a pet UUID.

#### API

Route handlers live under `src/app/api`.

Main endpoints:
- `src/app/api/v1/pets/route.ts`: fetch owned + shared pets for the dashboard.
- `src/app/api/v1/pet/route.ts`: CRUD for a single pet.
- `src/app/api/v1/visit/route.ts`: vet visits.
- `src/app/api/v1/weight/route.ts`: weight history.
- `src/app/api/v1/share/route.ts`: sharing pets with another user.
- `src/app/api/v1/uploads/route.ts`: create signed upload URLs.
- `src/app/api/v1/files/route.ts`: persist uploaded file records and delete files.
- `src/app/api/v1/files/sign/route.ts`: create signed download URLs.
- `src/app/api/pets/export/route.ts`: export data as ZIP/CSV.

#### Auth And Access Control

- Clerk route protection is configured in `src/proxy.ts`.
- Most route handlers call `auth()` from `@clerk/nextjs/server`.
- Shared access rules are centralized in `src/utils/pet-access.ts`.
- Read/write access is allowed for owners and shared users.
- Deleting a pet is owner-only.

When changing server routes, preserve these access checks.

#### Data Layer

- Prisma schema: `prisma/schema.prisma`
- Prisma helper: `src/utils/prisma.ts`

Main models:
- `Pet`: core profile, current weight, notes, alive/dead state, owner.
- `VetVisit`: dated medical visit + medication.
- `Weight`: historical weight entries.
- `File`: uploaded media metadata.
- `UserShare`: owner-to-user sharing relation.

`Pet.uuid` is the public identifier used in URLs. Internal relations still use numeric `id`.

#### Media Storage

- Spaces helpers live in `src/utils/spaces.ts`.
- Upload flow is split in two steps:
  1. Request a signed upload URL from `/api/v1/uploads`.
  2. After client upload succeeds, create the DB record via `/api/v1/files`.
- File reads often return signed GET URLs for private Spaces objects.

### Repository Layout

- `src/app`: App Router pages, layout, route handlers
- `src/components`: UI components and modals
- `src/hooks`: React Query hooks and small auth hook
- `src/utils`: Prisma, access control, Spaces, validation helpers
- `src/constants`: shared enums/options like animal types
- `src/types`: app-level TypeScript types
- `prisma`: schema and migrations
- `support`: Jest setup
- `public`: landing page images and static assets

### Existing Product Conventions

- The product language is Polish in the UI.
- The visual style is already established: soft cards, green/earth palette, rounded corners, glassmorphism-style surfaces.
- Animal type is stored as a free-form string even though the UI offers presets.
- The dashboard separates owned pets from shared pets and also splits rodents vs other animals.
- Dead pets are displayed after living pets.
- Current weight is duplicated: latest value on `Pet.weight`, history in `Weight` rows.

### Working Conventions For Agents

Prefer these patterns when editing the codebase:

- Keep changes minimal and local.
- Follow the existing App Router structure instead of introducing new architectural layers unless necessary.
- Reuse `withPrisma(...)` for route-handler database work.
- Reuse `getPetAccess(...)` for any pet-scoped authorization.
- If a mutation changes pet-related data, update React Query invalidation in `src/hooks/useQueries.ts`.
- If you add media features, keep the signed URL + DB record split consistent.
- Preserve the Polish UX copy unless the task is explicitly about rewriting content.
- Use the existing `@/` imports.

### Testing And Validation

Current automated tests are limited and live mostly around:
- component behavior for pet forms/details
- Spaces utilities
- upload/signing API routes

Relevant test files:
- `src/components/Pet/AddPetModal.test.tsx`
- `src/components/Pet/PetInfo.test.tsx`
- `src/utils/spaces.test.ts`
- `src/app/api/v1/files/sign/route.test.ts`
- `src/app/api/v1/uploads/route.test.ts`

For most code changes, at minimum consider:
- `npm run lint`
- `npm run test`

If you touch Prisma schema or migrations, also validate:
- `npm run generate`

### Watch-Outs

- `.env.example` is not fully aligned with the Prisma schema because `SHADOW_DATABASE_URL` is missing.
- Some route handlers return broad 500s and use light validation; be careful not to weaken existing authorization while refactoring.
- The repo may contain generated `.next/` output locally; avoid editing generated files.

### Good First Places To Read Before Changing Things

- `README.md`
- `prisma/schema.prisma`
- `src/components/Dashboard.tsx`
- `src/app/pet/[id]/page.tsx`
- `src/hooks/useQueries.ts`
- `src/utils/pet-access.ts`
- `src/utils/spaces.ts`
