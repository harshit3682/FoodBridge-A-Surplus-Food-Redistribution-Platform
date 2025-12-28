# Vercel Deployment Guide

## ✅ CURRENT SETUP (Root Directory = `client`)

Your project is configured with Root Directory set to `client` in Vercel settings.

### Current Configuration:

- **Root Directory**: `client` (set in Vercel project settings)
- **vercel.json**: Located in `client/vercel.json`
- **Build Output**: `client/dist/`

### The `client/vercel.json` file contains:

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

This minimal configuration lets Vercel:

- Auto-detect Vite framework
- Run `npm install` and `npm run build` automatically
- Find output in `dist/` directory
- Handle SPA routing with rewrites

---

## ⚠️ If You Get "No Entrypoint Found" Error

This error occurs when Vercel tries to find serverless functions after the static build. To fix:

1. **Verify Root Directory is set to `client`**:

   - Go to Vercel Dashboard → Your Project → Settings → General
   - Ensure "Root Directory" is set to: `client`
   - If not, set it and save

2. **Ensure `client/vercel.json` exists** with the content above (minimal, no buildCommand needed)

3. **Verify Environment Variable**:

   - Go to Settings → Environment Variables
   - Add `VITE_API_URL` = `https://foodbridge-a-surplus-food-redistribution.onrender.com`
   - Apply to: Production, Preview, Development

4. **Redeploy** after making changes

---

## Alternative: If Root Directory is NOT Set

If you cannot set Root Directory to `client`, you would need a different configuration, but this is NOT recommended as it causes the "No entrypoint found" error.

### Steps:

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project
3. Navigate to **Settings** → **General**
4. Scroll down to **Root Directory**
5. Click **Edit** and set it to: `client`
6. Click **Save**

### After setting Root Directory:

1. Ensure `client/vercel.json` exists with minimal content (see above)
2. Create a new `vercel.json` in the **root** directory with this content (NOT RECOMMENDED):

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

3. Vercel will now:
   - Auto-detect Vite
   - Run `npm install` and `npm run build` automatically
   - Find the output in `dist/` directory
   - Deploy successfully

---

## Method 2: Keep Root Directory as Project Root (Current Setup)

If you **cannot** or **don't want to** set the Root Directory, use the current `vercel.json` configuration.

### Current Configuration:

The `vercel.json` file is already configured with:

- `buildCommand`: Builds from `client/` directory
- `outputDirectory`: Points to `client/dist`
- `rewrites`: Handles SPA routing

### Verify:

1. Check deployment logs to ensure build completes
2. Verify `client/dist/index.html` exists after build
3. Check that all routes are working

---

## Environment Variables

The following environment variable is configured:

- `VITE_API_URL`: Your backend API URL

**Important:** If you set Root Directory to `client`, you may need to set this in Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add: `VITE_API_URL` = `https://foodbridge-a-surplus-food-redistribution.onrender.com`
3. Apply to: **Production**, **Preview**, and **Development**

---

## Troubleshooting 404 Errors

### If you get `DEPLOYMENT_NOT_FOUND` or 404:

1. **Check Build Logs:**

   - Go to your Vercel project → **Deployments**
   - Click on the latest deployment
   - Check the **Build Logs** tab
   - Look for any errors or warnings

2. **Verify Build Output:**

   - In build logs, check if `client/dist/index.html` was created
   - Look for: `✓ built in X.XXs` message

3. **Check Root Directory Setting:**

   - If using Method 1: Ensure Root Directory is set to `client`
   - If using Method 2: Ensure Root Directory is **NOT** set (should be empty or `/`)

4. **Verify vercel.json:**

   - If Root Directory = `client`: Use simple vercel.json (see Method 1)
   - If Root Directory = `/` (root): Use current vercel.json with buildCommand

5. **Common Issues:**
   - ❌ Build fails → Check for missing dependencies
   - ❌ Files not found → Verify outputDirectory path
   - ❌ Routes return 404 → Check rewrites configuration
   - ❌ Environment variables not working → Set in Vercel dashboard

---

## Quick Fix Checklist

- [ ] Choose deployment method (Method 1 or Method 2)
- [ ] Set Root Directory accordingly
- [ ] Update `vercel.json` based on chosen method
- [ ] Set `VITE_API_URL` environment variable
- [ ] Push changes to trigger new deployment
- [ ] Check deployment logs for errors
- [ ] Test all routes: `/`, `/login`, `/register`, `/donor`, `/ngo`, `/analytics`

---

## Still Having Issues?

1. Check Vercel deployment logs thoroughly
2. Try Method 1 (set Root Directory) - it's more reliable
3. Verify your `client/package.json` has the correct build script
4. Ensure `client/dist` folder is not in `.gitignore` (it's fine if it is - Vercel builds it)
5. Contact Vercel support with deployment logs if issues persist
