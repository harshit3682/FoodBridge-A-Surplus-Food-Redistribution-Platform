# Quick Setup Guide

## Prerequisites
- Node.js 14+ installed
- MongoDB Atlas account (free tier works) or local MongoDB

## Setup Steps

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

**To get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

### 3. Start Development Servers

**Option 1: Run separately (recommended for first-time setup)**

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

**Option 2: Run concurrently**

```bash
npm run dev:all
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Testing the Application

### 1. Register as a Donor
- Go to http://localhost:3000/register
- Select "Restaurant/Bakery/Hall (Donor)"
- Fill in the form and register

### 2. Register as an NGO
- Go to http://localhost:3000/register
- Select "NGO/Shelter (Claimer)"
- Fill in the form and register

### 3. Create a Food Listing (Donor)
- Login as a donor
- Click "Create Listing"
- Fill in food details and expiration time
- Submit

### 4. Claim Food (NGO)
- Login as an NGO
- Browse available listings
- Click "Claim Food" on any listing
- Wait for donor approval

### 5. Manage Claims (Donor)
- View received claims in the "Claims Received" tab
- Accept or reject claims
- Mark as completed after pickup

## Troubleshooting

### MongoDB Connection Error
- Verify your MongoDB URI is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure the database password is correct

### Port Already in Use
- Change the PORT in `.env` file
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

### CORS Errors
- Ensure backend is running on port 5000
- Check that frontend proxy is configured in `vite.config.js`

## Production Deployment

### Backend (Render/Railway)
1. Set environment variables in your hosting platform
2. Deploy the root directory (not the client folder)
3. Set build command: `npm install`
4. Set start command: `npm start`

### Frontend (Vercel/Netlify)
1. Build: `cd client && npm run build`
2. Deploy the `client/dist` directory
3. Set environment variable `REACT_APP_API_URL` to your backend URL



