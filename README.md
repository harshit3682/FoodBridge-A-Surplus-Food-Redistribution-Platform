# 🍽️ RescueRoute - Surplus Food Redistribution Platform

A full-stack web application connecting restaurants, bakeries, and wedding halls with NGOs and shelters to redistribute surplus food before it expires.

## 🌟 Features

- **Role-Based Access Control (RBAC)**: Separate dashboards for Donors and NGOs
- **Time-Sensitive Listings**: Automatic expiration handling with cron jobs
- **Real-Time Claims System**: NGOs can claim available food, donors can accept/reject claims
- **Analytics Dashboard**: Track listings, claims, and distribution statistics
- **Interactive Map**: Visualize food listings on a map
- **Modern UI**: Built with Material-UI for a beautiful user experience

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **node-cron** for automated expiry handling

### Frontend
- **React** with **Vite**
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **React-Leaflet** for map integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Rescue_Food
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rescueroute
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 5. Start the Development Server

**Option 1: Run separately**

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

**Option 2: Run concurrently (if installed)**

```bash
npm run dev:all
```

The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000`.

## 📁 Project Structure

```
Rescue_Food/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json
├── models/                # MongoDB models
│   ├── User.js
│   ├── FoodListing.js
│   └── Claim.js
├── routes/                # API routes
│   ├── auth.js
│   ├── listings.js
│   └── claims.js
├── middleware/            # Express middleware
│   └── auth.js
├── jobs/                  # Cron jobs
│   └── expireListings.js
├── server.js              # Express server
└── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Listings (Donor)
- `POST /api/listings` - Create a new listing
- `GET /api/listings/mine` - Get donor's listings
- `DELETE /api/listings/:id` - Delete a listing

### Listings (NGO)
- `GET /api/listings/available` - Get all available listings

### Claims
- `POST /api/claims` - Create a claim (NGO)
- `GET /api/claims/mine` - Get NGO's claims
- `GET /api/claims/received` - Get donor's received claims
- `PATCH /api/claims/:id/accept` - Accept a claim (Donor)
- `PATCH /api/claims/:id/reject` - Reject a claim (Donor)
- `PATCH /api/claims/:id/complete` - Complete a claim (Donor)

## 🎯 User Roles

### Donor
- Create food listings
- View all their listings
- Accept/reject claims from NGOs
- Mark claims as completed
- View analytics

### NGO
- Browse available food listings
- Claim available food
- Track claim status
- View analytics

## ⏰ Expiry Logic

The application automatically marks listings as EXPIRED using a cron job that runs every 5 minutes. Listings with `availableUntil` time in the past are automatically updated to EXPIRED status, and any pending claims for expired listings are rejected.

## 📊 Features Implemented

✅ Phase 1: Backend setup with Express and MongoDB  
✅ Phase 2: User authentication with JWT and RBAC  
✅ Phase 3: Food listings with donor/NGO endpoints  
✅ Phase 4: Claims system with status flow  
✅ Phase 5: Automated expiry logic with cron jobs  
✅ Phase 6: React frontend with dashboards  
✅ Phase 7: Analytics, maps, and polished UI  

## 🚢 Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas connection string is set
3. Deploy the root directory

### Frontend (Vercel/Netlify)

1. Build the frontend: `cd client && npm run build`
2. Deploy the `client/dist` directory
3. Set API URL in environment variables

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## 🤝 Contributing

This is a portfolio project demonstrating:
- Full-stack development skills
- Time-sensitive business logic
- Role-based access control
- Real-world problem solving

## 📄 License

ISC

## 👨‍💻 Author

Built as a resume-worthy project showcasing enterprise-level features including RBAC, time-sensitive logic, and real-world impact.

---

**Why This Project Stands Out:**
- ✅ Time-sensitive logic with automated expiry handling
- ✅ Enterprise-level RBAC implementation
- ✅ Real-world impact on food waste reduction
- ✅ Modern tech stack and best practices
- ✅ Complete full-stack implementation



