# 🚀 Deployment Guide

## Overview

This guide will help you deploy RescueRoute to production. The application consists of:

- **Backend**: Node.js/Express API (deployed on Render)
- **Frontend**: React/Vite app (deploy to Vercel/Netlify)

---

## ✅ Backend Deployment (Render) - COMPLETED

Your backend is already deployed at: `https://foodbridge-a-surplus-food-redistribution.onrender.com`

### Backend Environment Variables (Render Dashboard)

Make sure these are set in your Render dashboard:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=https://your-frontend-url.vercel.app
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Important**: Update `CLIENT_URL` and `FRONTEND_URL` after deploying the frontend!

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Create `.env.production` file** in `client/` directory:

```env
VITE_API_URL=https://foodbridge-a-surplus-food-redistribution.onrender.com
```

2. **Build the frontend locally to test**:

```bash
cd client
npm run build
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? rescueroute-frontend (or your choice)
# - Directory? ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. **Root Directory**: Set to `client`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Environment Variables**:
   ```
   VITE_API_URL=https://foodbridge-a-surplus-food-redistribution.onrender.com
   ```
8. Click "Deploy"

### Step 3: Update Backend CORS

After frontend is deployed, update Render environment variables:

1. Go to Render Dashboard → Your Service → Environment
2. Update:
   ```
   CLIENT_URL=https://your-vercel-app.vercel.app
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Redeploy the backend service

---

## 🌐 Alternative: Frontend Deployment (Netlify)

### Step 1: Create `netlify.toml` in `client/` directory:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. **Base directory**: `client`
5. **Build command**: `npm run build`
6. **Publish directory**: `dist`
7. **Environment variables**:
   ```
   VITE_API_URL=https://foodbridge-a-surplus-food-redistribution.onrender.com
   ```
8. Click "Deploy site"

---

## 🔧 Configuration Files

### `client/vite.config.js` (Already Updated)

The Vite config is set up for production builds.

### `vercel.json` (For Vercel)

```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/dist",
  "devCommand": "cd client && npm run dev",
  "installCommand": "cd client && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `netlify.toml` (For Netlify - Create in `client/`)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is deployed and accessible
- [ ] Backend `CLIENT_URL` updated to frontend URL
- [ ] Backend redeployed after CORS update
- [ ] Test registration on frontend
- [ ] Test login on frontend
- [ ] Test API calls from frontend
- [ ] Test Socket.io connection (if applicable)

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /" on Backend

**Solution**: This is normal! The backend is API-only. The root route now returns API info.

### Issue: CORS Errors

**Solution**:

1. Update `CLIENT_URL` in Render to your frontend URL
2. Redeploy backend
3. Clear browser cache

### Issue: API Calls Failing

**Solution**:

1. Check `VITE_API_URL` in frontend environment variables
2. Verify backend is running (check `/health` endpoint)
3. Check browser console for errors

### Issue: Socket.io Not Connecting

**Solution**:

1. Update `CLIENT_URL` in backend
2. Check Socket.io CORS settings in `server.js`
3. Verify WebSocket support on hosting platform

---

## 📝 Environment Variables Summary

### Backend (Render)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel/Netlify)

```
VITE_API_URL=https://foodbridge-a-surplus-food-redistribution.onrender.com
```

---

## 🔗 URLs After Deployment

- **Backend API**: `https://foodbridge-a-surplus-food-redistribution.onrender.com`
- **Frontend**: `https://your-app.vercel.app` (or Netlify URL)
- **Health Check**: `https://foodbridge-a-surplus-food-redistribution.onrender.com/health`
- **API Root**: `https://foodbridge-a-surplus-food-redistribution.onrender.com/`

---

## 🎯 Quick Deploy Commands

### Deploy Frontend to Vercel (CLI)

```bash
cd client
npm i -g vercel
vercel --prod
```

### Deploy Frontend to Netlify (CLI)

```bash
cd client
npm i -g netlify-cli
netlify deploy --prod
```

---

Your backend is ready! Now deploy the frontend and update the CORS settings. 🚀
