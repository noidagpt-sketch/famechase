# FameChase.com

## Overview

FameChase is a creator growth platform that helps aspiring influencers discover their potential, get AI-powered analysis, and purchase digital products (growth kits, courses, templates). Users take a quiz about their creator profile, receive a personalized "Fame Score" with growth recommendations, and can buy digital products through a PayU payment gateway. The app includes an admin dashboard for tracking users and purchases.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **2026-02-10**: Built production-ready Express backend with PostgreSQL integration:
  - JWT authentication (signup, login, admin login) with bcrypt password hashing
  - Auto-created 6 database tables (users, admins, quiz_data, downloads, submissions, purchases)
  - Admin account auto-seeded from ADMIN_EMAIL/ADMIN_PASSWORD env vars on startup
  - All frontend forms (quiz, shop purchases, downloads) now save data to PostgreSQL via REST API
  - Admin dashboard fetches real data from PostgreSQL with JWT-authenticated endpoints
  - Vite proxy configured to route `/api` requests to Express server on port 3001

## System Architecture

### Frontend (React SPA)

- **Framework**: React 18 with React Router 6 in SPA mode, built with Vite
- **Styling**: TailwindCSS 3 with CSS variables for theming (dark mode default), shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack React Query for server state, local React state otherwise
- **Path aliases**: `@/` maps to `./client/`, `@shared/` maps to `./shared/`
- **Entry point**: `client/App.tsx` renders into `index.html`'s `#root` div
- **Key pages**: Index (landing), QuizStart -> Quiz -> Results (main user flow), ShopNew (product store), PaymentSuccess/PaymentFailure, AdminLogin -> AdminDashboard/AdminAnalytics, TestSupabase (debug)
- **Routes**: All defined in `client/App.tsx`. Add new routes above the catch-all `*` route.

### Backend (Express API)

- **Express server**: `server/index.ts` creates the Express app with API routes. Runs standalone on port 3001 via `server/standalone.ts`.
- **Database init**: `server/db-init.ts` auto-creates all 6 PostgreSQL tables on startup and seeds admin account from environment variables.
- **Auth system**: `server/middleware/auth.ts` provides JWT token generation/verification, `authMiddleware` and `adminMiddleware` for role-based access control.
- **Auth routes**: `server/routes/auth.ts` handles user signup, login, admin login with bcrypt password hashing.
- **User analytics routes**: `server/routes/user-analytics.ts` handles quiz data capture, download tracking, purchase recording, and admin data retrieval.
- **Vite proxy**: In development, Vite proxies `/api` requests to `http://localhost:3001`.

### Database (Replit PostgreSQL + Optional Supabase)

- **Primary database**: Replit PostgreSQL (Neon-backed), accessed via `server/db.ts` using the `pg` package with connection pooling via `DATABASE_URL`.
- **Tables**: `users` (registered users), `admins` (admin accounts), `quiz_data` (quiz submissions), `downloads` (download tracking), `submissions` (form submissions), `purchases` (payment records).
- **Auto-initialization**: Tables are created automatically on server startup via `server/db-init.ts`. Admin account is seeded from `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.
- **Supabase (optional)**: Still configured as a fallback for client-side operations via `client/lib/supabase.ts`. The app gracefully degrades to "demo mode" when Supabase is not configured.

### Authentication & Authorization

- **JWT tokens**: 7-day expiration, stored in `localStorage` on frontend as `famechase_admin_token`.
- **Password hashing**: bcrypt with salt rounds of 12.
- **Admin login**: Separate `/api/auth/admin-login` endpoint checks `admins` table.
- **User login**: `/api/auth/login` and `/api/auth/signup` endpoints check `users` table.
- **Middleware**: `authMiddleware` validates JWT on protected routes, `adminMiddleware` checks for admin role.
- **Admin session**: 24-hour session timeout enforced on frontend.

### Payment System (PayU)

- **PayU gateway** is integrated for processing payments in Indian Rupees.
- **Flow**: Client initiates payment -> Netlify function generates hash -> Redirect to PayU -> PayU posts back to success/failure URLs -> Webhook records transaction.
- **Environment variables**: `PAYU_KEY`, `PAYU_SALT`, `VITE_PAYU_MERCHANT_KEY`, `VITE_PAYU_SALT`, `VITE_PAYU_MODE` (test/production).

### AI Agent System

- **Multi-provider LLM**: Supports OpenAI, Anthropic, and Google Gemini via environment variables.
- **Services** in `server/services/`: `ai-agent.ts`, `market-research.ts`, `personalization.ts`, `pdf-generator.ts`, `dynamic-ai-analysis.ts`, `real-time-market-research.ts`, `commercial-viability.ts`.
- **API route**: `POST /api/ai-agent-analysis` triggers comprehensive creator analysis.

### Build & Dev

- **Dev workflow**: Runs `npx tsx server/standalone.ts` (API on port 3001) and `vite` (frontend on port 5000) concurrently.
- **Vite proxy**: `/api` requests are proxied to `http://localhost:3001` during development.
- **Production build**: `npm run build` builds both client (`dist/spa/`) and server (`dist/server/`).
- **Testing**: Vitest (`npm test`), test files use `.spec.ts` suffix.
- **TypeScript**: Strict mode is OFF. Path mapping configured in `tsconfig.json`.

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/ping | None | Health check |
| POST | /api/auth/signup | None | User registration |
| POST | /api/auth/login | None | User login |
| POST | /api/auth/admin-login | None | Admin login |
| GET | /api/auth/me | JWT | Get current user info |
| POST | /api/user-analytics/quiz | None | Save quiz submission |
| POST | /api/user-analytics/download | None | Track file download |
| POST | /api/user-analytics/purchase | None | Record purchase |
| POST | /api/user-analytics/submission | None | Save form submission |
| GET | /api/user-analytics/:userId | None | Get user analytics |
| GET | /api/admin/users | JWT+Admin | Get all users (admin) |
| GET | /api/admin/purchases | JWT+Admin | Get all purchases (admin) |
| GET | /api/admin/downloads | JWT+Admin | Get all downloads (admin) |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| DATABASE_URL | PostgreSQL connection string (auto-set by Replit) |
| ADMIN_EMAIL | Auto-seeded admin email (famechase.com@gmail.com) |
| ADMIN_PASSWORD | Auto-seeded admin password |
| JWT_SECRET | Secret key for JWT token signing |
| API_PORT | Express API server port (default: 3001) |

### Key NPM Packages
- `express` + `cors` - Backend API server
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `@supabase/supabase-js` - Supabase client (optional)
- `pdf-lib` - PDF generation
- `@tanstack/react-query` - Data fetching/caching
- `react-router-dom` - Client-side routing
- `@radix-ui/*` - Accessible UI primitives (via shadcn/ui)
- `lucide-react` - Icon library
- `tailwind-merge` + `clsx` - Class name utilities
