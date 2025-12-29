# ✅ FINAL FIX - Vercel "No Entrypoint Found" Error

## Current Configuration

The `client/vercel.json` is now configured correctly:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
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

## ⚠️ CRITICAL: Vercel Project Settings

You **MUST** verify these settings in Vercel Dashboard:

### 1. Root Directory
- Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **General**
- **Root Directory** MUST be set to: `client`
- If it's `/` or empty, change it to `client` and **Save**

### 2. Build & Development Settings
- Go to: **Settings** → **General** → **Build & Development Settings**
- **Framework Preset**: Should be **"Other"** or **"Vite"** (auto-detected)
- **Build Command**: Should be empty (let `@vercel/static-build` handle it)
- **Output Directory**: Should be empty (specified in vercel.json)

### 3. Environment Variables
- Go to: **Settings** → **Environment Variables**
- Add: `VITE_API_URL` = `https://foodbridge-a-surplus-food-redistribution.onrender.com`
- Apply to: **Production**, **Preview**, **Development**

## Why This Configuration Works

1. **`@vercel/static-build`**: Explicitly tells Vercel this is a static site, NOT serverless functions
2. **`builds` array**: Prevents Vercel from auto-detecting and looking for serverless functions
3. **`distDir: "dist"`**: Tells Vercel where to find the built static files
4. **`rewrites`**: Handles SPA routing (all routes → index.html)

## If Error Still Persists

If you still get "No entrypoint found" after verifying settings:

1. **Delete the deployment** in Vercel dashboard
2. **Redeploy** from scratch
3. **Check build logs** - the build should complete with `✓ built in X.XXs`
4. **Verify** that `dist/index.html` exists in build logs

## Commit and Deploy

```bash
git add client/vercel.json
git commit -m "Fix Vercel deployment - use @vercel/static-build"
git push
```

Then trigger a new deployment in Vercel.


