# 🔧 Fix Vercel "No Entrypoint Found" Error

## Problem
After successful build, Vercel shows: `Error: No entrypoint found. Searched for: app.{js,cjs,mjs,ts,cts,mts}...`

This happens because Vercel is looking for serverless functions when it should only serve static files.

## ✅ Solution (3 Steps)

### Step 1: Verify Vercel Project Settings

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **General**
4. **CRITICAL**: Ensure **Root Directory** is set to: `client`
   - If it's not set or set to `/`, change it to `client`
   - Click **Save**

### Step 2: Verify `client/vercel.json` File

The file `client/vercel.json` should exist with this **EXACT** content:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://foodbridge-a-surplus-food-redistribution.onrender.com"
  }
}
```

**Important**: 
- ✅ File should be in `client/` directory (NOT root)
- ✅ Should be minimal (no `buildCommand`, `outputDirectory`, or `framework`)
- ✅ Let Vercel auto-detect Vite

### Step 3: Set Environment Variable in Vercel Dashboard

1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://foodbridge-a-surplus-food-redistribution.onrender.com`
   - **Environments**: Select all (Production, Preview, Development)
3. Click **Save**

## After Making Changes

1. **Commit and push** your changes:
   ```bash
   git add client/vercel.json
   git commit -m "Fix Vercel deployment configuration"
   git push
   ```

2. **Trigger a new deployment** in Vercel (or it will auto-deploy)

3. **Check deployment logs** to verify:
   - Build completes: `✓ built in X.XXs`
   - No "No entrypoint found" error
   - Deployment status shows "Ready"

## Why This Works

- **Root Directory = `client`**: Tells Vercel to only look in the client directory
- **Minimal vercel.json**: Lets Vercel auto-detect Vite and handle the build automatically
- **No buildCommand/outputDirectory**: Vercel's auto-detection handles this for Vite projects
- **Environment Variable in Dashboard**: Ensures it's available during build time

## If Error Persists

1. **Double-check Root Directory** is set to `client` (not `/` or empty)
2. **Verify** `client/vercel.json` exists and has the exact content above
3. **Check** that `client/package.json` has `"build": "vite build"` script
4. **Ensure** no other `vercel.json` files exist in the root directory
5. **Review** deployment logs for any other errors

## Current File Structure

```
Rescue_Food/
├── client/
│   ├── vercel.json          ← Should be here (minimal config)
│   ├── package.json
│   ├── vite.config.js
│   ├── dist/                ← Build output (auto-generated)
│   └── src/
├── server.js                ← Backend (ignored by Vercel)
├── package.json             ← Backend (ignored by Vercel)
└── ...
```

**Key Point**: With Root Directory = `client`, Vercel only sees the `client/` directory and ignores the root-level backend files.


