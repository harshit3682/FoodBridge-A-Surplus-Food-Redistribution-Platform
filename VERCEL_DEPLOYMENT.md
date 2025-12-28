# Vercel Deployment Guide

## ⚠️ CRITICAL: Choose One Deployment Method

You have **TWO options** for deploying this project. Choose the one that works best for you.

---

## Method 1: Set Root Directory (RECOMMENDED - Easiest)

This is the **recommended approach** and will make Vercel auto-detect Vite correctly.

### Steps:

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project
3. Navigate to **Settings** → **General**
4. Scroll down to **Root Directory**
5. Click **Edit** and set it to: `client`
6. Click **Save**

### After setting Root Directory:

1. **Delete or rename** the current `vercel.json` (or update it to be simpler)
2. Create a new `vercel.json` in the **root** directory with this content:

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
