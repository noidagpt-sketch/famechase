// DEPRECATED: This file is no longer used.
//
// Please use the primary Supabase client from:
// ➜ client/lib/supabase.ts
//
// This consolidated client provides:
// - Proper environment variable validation
// - Error handling and fallbacks
// - Database helper functions (dbHelpers)
// - Authentication helpers (authHelpers)
//
// NOTE: The environment variable names were incorrect in this file.
// Use VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (not REACT_APP_*)
//
// Migration:
// Change: import { supabase } from '@/backend/supabaseClient'
// To:     import { supabase, dbHelpers, authHelpers } from '@/lib/supabase'
