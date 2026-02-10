# FameChase.com

## Overview

FameChase is a creator growth platform that helps aspiring influencers discover their potential, get AI-powered analysis, and purchase digital products (growth kits, courses, templates). Users take a quiz about their creator profile, receive a personalized "Fame Score" with growth recommendations, and can buy digital products through a PayU payment gateway. The app includes an admin dashboard for tracking users and purchases.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React SPA)

- **Framework**: React 18 with React Router 6 in SPA mode, built with Vite
- **Styling**: TailwindCSS 3 with CSS variables for theming (dark mode default), shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack React Query for server state, local React state otherwise
- **Path aliases**: `@/` maps to `./client/`, `@shared/` maps to `./shared/`
- **Entry point**: `client/App.tsx` renders into `index.html`'s `#root` div
- **Key pages**: Index (landing), QuizStart → Quiz → Results (main user flow), ShopNew (product store), PaymentSuccess/PaymentFailure, AdminLogin → AdminDashboard/AdminAnalytics, TestSupabase (debug)
- **Routes**: All defined in `client/App.tsx`. Add new routes above the catch-all `*` route.

### Backend (Express + Netlify Functions)

- **Express server**: `server/index.ts` creates the Express app with API routes. Used in dev via Vite and in production via `server/node-build.ts`. Only create server endpoints when strictly necessary (e.g., private key handling, server-side-only logic).
- **Netlify Functions**: `netlify/functions/` contains serverless functions for payment processing (`payu-initiate.js`, `payu-return.js`, `payu-webhook.js`, `api.ts`). These handle PayU hash generation, payment verification, and webhook processing.
- **Separate backend**: There's also a standalone `backend/` directory with its own `server.js` and `package.json` — this is an alternative Express server for PayU payment processing with direct Supabase integration. It runs independently on its own port.

### Database (Supabase / PostgreSQL)

- **Supabase** is used as the primary database and auth provider. Client-side access is through `client/lib/supabase.ts` which validates environment variables and provides helper functions (`dbHelpers`, `authHelpers`).
- **Environment variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for client-side; `SUPABASE_URL` and `SUPABASE_ANON_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) for server-side.
- **Graceful degradation**: The app runs in "demo mode" with mock/local data when Supabase is not configured. The `isSupabaseConfigured()` function checks for valid credentials.
- **Database setup**: SQL scripts are expected at `scripts/setup-database.sql` (referenced but not present in repo).
- **Tables used**: `users`, `purchases`, `products`, `user_quiz_data` (based on code references).

### Payment System (PayU)

- **PayU gateway** is integrated for processing payments in Indian Rupees (₹).
- **Flow**: Client initiates payment → Netlify function generates hash → Redirect to PayU → PayU posts back to success/failure URLs → Webhook records transaction in Supabase.
- **Environment variables**: `PAYU_KEY`, `PAYU_SALT`, `VITE_PAYU_MERCHANT_KEY`, `VITE_PAYU_SALT`, `VITE_PAYU_MODE` (test/production).
- **Client-side hash**: `client/lib/payu.ts` uses CryptoJS for hash generation (note: salt on client side is only for test mode).

### AI Agent System

- **Multi-provider LLM**: Supports OpenAI, Anthropic, and Google Gemini via environment variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`).
- **Services** in `server/services/`: `ai-agent.ts` (provider abstraction), `market-research.ts` (market analysis), `personalization.ts` (user-specific scoring), `pdf-generator.ts` (PDF reports using pdf-lib), `dynamic-ai-analysis.ts`, `real-time-market-research.ts`, `commercial-viability.ts`.
- **API route**: `POST /api/ai-agent-analysis` triggers comprehensive creator analysis.
- **Client hook**: `client/hooks/useAIAgentAnalysis.ts` provides React hook for calling the analysis API.

### Build & Dev

- **Dev server**: `npm run dev` runs Vite dev server on port 5000.
- **Production build**: `npm run build` builds both client (`dist/spa/`) and server (`dist/server/`). Production server serves the SPA and handles API routes.
- **Server build config**: `vite.config.server.ts` builds the Express server as an ES module targeting Node 22.
- **Testing**: Vitest (`npm test`), test files use `.spec.ts` suffix.
- **TypeScript**: Strict mode is OFF. Path mapping configured in `tsconfig.json`.

### Shared Code

- `shared/api.ts` contains TypeScript interfaces shared between client and server (request/response types for AI analysis, market research, user analytics).

### Admin System

- Simple credential-based admin login (username/password stored client-side, not secure for production).
- Admin dashboard shows user data, purchases, and analytics from Supabase.
- Admin analytics page fetches from `/api/user-analytics/admin/all`.

### Product System

- Digital products defined in `client/lib/products.ts` with PDF generation using `pdf-lib`.
- Products: Creator Growth Kit (₹99), Instagram Reels Mastery (₹197), Brand Collaboration Masterclass (₹149), Complete Bundle (₹297).
- Client-side PDF generation for product downloads.

## External Dependencies

### Services & APIs
- **Supabase**: Database (PostgreSQL), authentication, real-time subscriptions. Required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY`.
- **PayU Payment Gateway**: Payment processing for Indian market. Required env vars: `PAYU_KEY`, `PAYU_SALT`. Test mode URL: `https://test.payu.in/_payment`.
- **OpenAI API**: GPT-4 for AI analysis. Env var: `OPENAI_API_KEY`.
- **Anthropic API**: Claude for reasoning/analysis. Env var: `ANTHROPIC_API_KEY`.
- **Google Gemini API**: Trend analysis. Env var: `GOOGLE_API_KEY`.
- **Netlify**: Hosting and serverless functions. Functions in `netlify/functions/`.

### Key NPM Packages
- `express` — Backend API server
- `@supabase/supabase-js` — Supabase client
- `pdf-lib` — PDF generation (both client and server)
- `crypto-js` — Client-side cryptographic hashing (PayU)
- `zod` — Schema validation
- `@tanstack/react-query` — Data fetching/caching
- `react-router-dom` — Client-side routing
- `@radix-ui/*` — Accessible UI primitives (via shadcn/ui)
- `lucide-react` — Icon library
- `tailwind-merge` + `clsx` — Class name utilities
- `sonner` — Toast notifications