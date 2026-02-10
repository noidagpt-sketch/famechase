# Fly.dev Deployment Guide - Supabase Configuration

## Overview

This guide explains how to properly deploy the application to Fly.dev with Supabase backend connectivity.

## Current Issues

The errors you're seeing are caused by missing or misconfigured environment variables on your Fly.dev deployment:

```
Supabase upsert error: "Failed to fetch"
Supabase update error: "Failed to fetch"
Supabase insert error: "Failed to fetch"
```

These indicate that the Supabase client is either:

1. Not initialized (missing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
2. Unable to reach Supabase servers from Fly.dev
3. Blocked by CORS policies

## Prerequisites

You need:

- A Fly.dev account (https://fly.io)
- A Supabase project (https://supabase.com)
- Supabase project URL and anon key
- Fly CLI installed (`flyctl`)

## Solution: Setting Environment Variables

### Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like `https://your-project.supabase.co`)
   - **Anon/Public key** (long JWT token)

### Step 2: Set Fly.dev Secrets

Using Fly CLI:

```bash
# Set Supabase URL
flyctl secrets set VITE_SUPABASE_URL=https://your-project.supabase.co

# Set Supabase Anon Key (the public/anon key from Step 1)
flyctl secrets set VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# For backend/server operations (optional, but recommended):
flyctl secrets set SUPABASE_URL=https://your-project.supabase.co
flyctl secrets set SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Step 3: Verify Configuration

Check that secrets are set:

```bash
flyctl secrets list
```

You should see:

```
NAME                      DIGEST
VITE_SUPABASE_URL         sha256:abc123...
VITE_SUPABASE_ANON_KEY    sha256:xyz789...
```

### Step 4: Redeploy

Deploy with the new environment variables:

```bash
flyctl deploy
```

### Step 5: Verify the Fix

1. Visit your Fly.dev app
2. Open the browser DevTools (F12)
3. Check the Console tab
4. Look for one of these messages:
   - ✅ `Supabase initialized successfully` - Working!
   - ⚠️ `Supabase URL not configured or invalid` - Check Step 1-2
   - ⚠️ `Supabase anon key not configured or invalid` - Check Step 1-2

## Troubleshooting

### "Failed to fetch" errors still occurring

This indicates a CORS issue. Supabase may be blocking your Fly.dev domain.

**Solution:**

1. Go to your Supabase project **Settings** → **API** → **CORS**
2. Add your Fly.dev domain:
   ```
   https://your-app.fly.dev
   ```
3. Save and redeploy your Fly app

### Environment variables not loading

Check if secrets are properly set:

```bash
flyctl secrets list
```

If missing, re-run the `flyctl secrets set` commands from Step 2.

### Supabase connection timeout

1. Verify your Supabase project is active (not paused)
2. Check Supabase Status page: https://status.supabase.com
3. Try clearing browser cache and refreshing
4. Check Fly.dev logs:
   ```bash
   flyctl logs
   ```

## Additional Environment Variables

You may also need to set:

```bash
# For PayU integration (if using payments)
flyctl secrets set VITE_PAYU_MERCHANT_KEY=your-merchant-key
flyctl secrets set VITE_PAYU_SALT=your-salt
flyctl secrets set VITE_PAYU_BASE_URL=https://test.payu.in/_payment
flyctl secrets set VITE_PAYU_MODE=test

# For application URLs
flyctl secrets set VITE_APP_URL=https://your-app.fly.dev
flyctl secrets set VITE_APP_ENV=production
```

## Backend Server Configuration

If using the Express backend (`backend/server.js`):

```bash
# Backend Supabase connection
flyctl secrets set SUPABASE_URL=https://your-project.supabase.co
flyctl secrets set SUPABASE_ANON_KEY=your-anon-key

# Optional: Service role key for backend operations
# ⚠️ Never expose service role key in frontend!
flyctl secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Monitoring & Debugging

### View Real-time Logs

```bash
# Stream logs from your Fly app
flyctl logs -a your-app-name

# View historical logs
flyctl logs -a your-app-name --since 1h
```

### Check Supabase Status

In browser console:

```javascript
// Check if Supabase is configured
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test Supabase connection
import { supabase } from "./client/lib/supabase";
console.log("Supabase client:", supabase);
```

### Test API Connection

```bash
# From local machine
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Important Notes

### Security Best Practices

1. **Never commit `.env` files** - Use Fly secrets
2. **Use Anon Key for frontend** - Not the service role key
3. **Rotate keys periodically** - Especially if exposed
4. **Monitor Supabase logs** - Check for unauthorized access

### Environment Variable Naming

- Frontend (React): Prefix with `VITE_` (e.g., `VITE_SUPABASE_URL`)
- Backend (Node): No prefix needed (e.g., `SUPABASE_URL`)
- The build process automatically exposes `VITE_` variables to browser

## Deploying Again

After setting/updating secrets, you must redeploy:

```bash
flyctl deploy
```

## Complete Checklist

- [ ] Supabase project created
- [ ] Project URL and anon key obtained
- [ ] Run `flyctl secrets set VITE_SUPABASE_URL=...`
- [ ] Run `flyctl secrets set VITE_SUPABASE_ANON_KEY=...`
- [ ] Verify secrets with `flyctl secrets list`
- [ ] Deploy with `flyctl deploy`
- [ ] Check browser console for success message
- [ ] Test API endpoints
- [ ] Verify data appears in Supabase dashboard

## Success Indicators

When properly configured, you should see:

1. **Browser Console**: `✅ Supabase initialized successfully`
2. **Supabase Dashboard**: New data appears when you make requests
3. **API Responses**: Payment/data operations complete without errors
4. **Fly Logs**: No "Failed to fetch" errors

## Support

- **Fly.dev Docs**: https://fly.io/docs/
- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://supabase.com/community

---

**Last Updated**: January 24, 2026
