# 📊 Dashboard Features & Functionalities Documentation

## Overview

RescueRoute is a surplus food redistribution platform with role-based dashboards for **Donors** (restaurants, bakeries, wedding halls) and **NGOs** (shelters, food banks). This document elaborates on all dashboard functionalities and features.

---

## 🏗️ Architecture Overview

### Application Structure

- **Frontend**: React with Vite, Material-UI (MUI), React Router
- **Backend**: Node.js/Express with MongoDB
- **Authentication**: JWT-based with role-based access control (RBAC)
- **Real-time Features**: Automated expiry handling via cron jobs

### User Roles

1. **DONOR**: Can create food listings, manage claims
2. **NGO**: Can browse and claim available food listings

---

## 🎯 Layout Component (Shared Navigation)

**Location**: `client/src/components/Layout.jsx`

### Features:

1. **Responsive AppBar**

   - Gradient green theme (sustainability-focused)
   - Brand name: "🍽️ RescueRoute"
   - User avatar with initials
   - Role badge display

2. **Navigation Menu**

   - **Dashboard Button**: Routes to role-specific dashboard (`/donor` or `/ngo`)
   - **Analytics Button**: Routes to `/analytics` page
   - Active route highlighting (bold font weight)

3. **User Menu (Avatar Dropdown)**

   - User name and email display
   - Role chip (DONOR/NGO) with color coding
   - Logout functionality
   - Placeholder for future profile/settings

4. **Container Layout**
   - Max width: `lg` (1280px)
   - Gradient background
   - Responsive padding and margins

---

## 🍽️ Donor Dashboard

**Location**: `client/src/pages/DonorDashboard.jsx`  
**Route**: `/donor`  
**Access**: Private, DONOR role only

### 1. Header Section

- **Welcome Message**: Personalized greeting with donor name
- **Quick Action**: "Create Listing" button with gradient styling
- **Visual Design**: Purple gradient background with glassmorphism effect

### 2. Statistics Cards (4 Metrics)

Displays real-time statistics in gradient cards:

#### a. Total Listings Card

- **Icon**: Restaurant
- **Metric**: Total number of listings created
- **Color**: Purple gradient (#667eea → #764ba2)
- **Hover Effect**: Lift animation

#### b. Available Now Card

- **Icon**: TrendingUp
- **Metric**: Count of listings with `AVAILABLE` status
- **Color**: Pink gradient (#f093fb → #f5576c)
- **Purpose**: Quick view of active listings

#### c. Pending Claims Card

- **Icon**: Pending
- **Metric**: Number of claims awaiting donor's response
- **Color**: Blue gradient (#4facfe → #00f2fe)
- **Action Indicator**: Shows claims needing attention

#### d. Completed Card

- **Icon**: CheckCircle
- **Metric**: Successfully completed claims
- **Color**: Green gradient (#43e97b → #38f9d7)
- **Purpose**: Track successful food redistributions

### 3. Tabbed Interface

#### Tab 1: My Listings

- **Display**: Grid layout of all donor's food listings
- **Features**:
  - **Listing Cards**: Each listing shows:
    - Title and description
    - Status chip (color-coded: AVAILABLE=green, CLAIMED=blue, EXPIRED=red, COMPLETED=gray)
    - Category and quantity with unit
    - Expiry date/time with clock icon
    - Pickup location (city, state) with location icon
    - Claimed by information (if applicable)
    - Delete button (only for AVAILABLE listings)
  - **Empty State**: Encourages first listing creation
  - **Visual Indicators**: Green border for available listings

#### Tab 2: Claims Received

- **Display**: All claims made by NGOs on donor's listings
- **Features**:
  - **Claim Cards**: Each claim shows:
    - Listing title
    - NGO information (name, organization, phone)
    - Claim message (if provided)
    - Quantity details
    - Status chip with color coding
  - **Action Buttons** (based on status):
    - **PENDING**: Accept (green) / Reject (red) buttons
    - **ACCEPTED**: "Mark as Completed" button
    - **COMPLETED/REJECTED**: Read-only display
  - **Badge Indicator**: Shows pending count in tab label
  - **Empty State**: Message when no claims received

### 4. Create Listing Dialog

**Trigger**: "Create Listing" button in header

**Form Fields**:

1. **Title** (required): Name of the food listing
2. **Description** (required): Detailed description (multiline)
3. **Category** (dropdown): Bakery, Main Course, Salads, Desserts, Beverages, Other
4. **Quantity** (required): Number value (min: 1)
5. **Unit** (dropdown): servings, packages, items, kg, liters
6. **Available Until** (required): DateTime picker for expiry
7. **Pickup Location**:
   - Street address
   - City
   - State
   - Zip code
8. **Special Instructions** (optional): Additional notes for NGOs

**Validation**:

- Required fields validation
- Date validation (availableUntil must be in future)
- Server-side validation for data integrity

**Post-Submit**: Refreshes listings and claims data

### 5. Claim Management Actions

#### Accept Claim

- Updates claim status to `ACCEPTED`
- Updates listing status to `CLAIMED`
- Sets `claimedBy` and `claimedAt` on listing
- Automatically rejects other pending claims for same listing
- Shows success message

#### Reject Claim

- Prompts for optional rejection reason
- Updates claim status to `REJECTED`
- Stores rejection reason
- Listing remains `AVAILABLE` for other claims

#### Complete Claim

- Updates claim status to `COMPLETED`
- Updates listing status to `COMPLETED`
- Sets `completedAt` timestamp
- Finalizes the food redistribution process

### 6. Delete Listing

- **Condition**: Only available for listings with `AVAILABLE` status
- **Confirmation**: Browser confirm dialog
- **Restriction**: Cannot delete claimed or completed listings
- **Effect**: Permanently removes listing from database

---

## 🏢 NGO Dashboard

**Location**: `client/src/pages/NGODashboard.jsx`  
**Route**: `/ngo`  
**Access**: Private, NGO role only

### 1. Header Section

- **Welcome Message**: Personalized greeting with NGO name
- **Description**: "Browse available food listings and manage your claims"
- **Visual Design**: Purple gradient matching donor dashboard

### 2. Statistics Cards (4 Metrics)

#### a. Available Listings Card

- **Icon**: LocalOffer
- **Metric**: Total available food listings in system
- **Color**: Purple gradient
- **Purpose**: Shows current opportunities

#### b. Pending Claims Card

- **Icon**: Pending
- **Metric**: Claims awaiting donor response
- **Color**: Pink gradient
- **Purpose**: Track claims in review

#### c. Accepted Claims Card

- **Icon**: CheckCircle
- **Metric**: Claims approved by donors
- **Color**: Blue gradient
- **Purpose**: Track approved pickups

#### d. Completed Card

- **Icon**: Assignment
- **Metric**: Successfully completed claims
- **Color**: Green gradient
- **Purpose**: Track successful distributions

### 3. Available Food Listings Section

**Features**:

- **Grid Layout**: Responsive card grid
- **Listing Cards**: Each card displays:

  - **Title & Description**: Food item details
  - **Status Badge**: Shows if already claimed by this NGO
  - **Category & Quantity**: Food type and amount with unit
  - **Time Remaining**: Countdown to expiry (e.g., "5h 30m remaining")
    - Color-coded: Red for urgent (expiring soon)
    - Shows "Expired" if past expiry
  - **Location**: City and state with location icon
  - **Donor Information**: Name and contact phone
  - **Claim Status Alert**:
    - Green alert for ACCEPTED claims
    - Blue alert for PENDING claims
    - Red alert with rejection reason if REJECTED

- **Claim Button**:

  - Only visible for unclaimed listings
  - Opens claim dialog
  - Gradient purple styling with hover effects

- **Visual Indicators**:
  - Green border for available listings
  - Status chips for claimed listings
  - Empty state when no listings available

### 4. Claim Dialog

**Trigger**: "Claim Food" button on listing card

**Features**:

- **Listing Preview**: Shows title and description
- **Message Field** (optional): Multiline text for donor communication
- **Actions**: Cancel / Submit Claim buttons
- **Validation**: Ensures listing is still available
- **Post-Submit**: Refreshes listings and claims, shows success message

### 5. My Claims Section

**Display**: All claims made by the NGO

**Claim Cards Show**:

- Listing title
- Status chip (color-coded)
- Donor information
- Claim message (if provided)
- Rejection reason alert (if rejected)

**Status Flow**:

1. **PENDING** → Awaiting donor response
2. **ACCEPTED** → Approved, ready for pickup
3. **REJECTED** → Declined by donor (with reason)
4. **COMPLETED** → Successfully picked up

**Empty State**: Encourages making first claim

---

## 📈 Analytics Dashboard

**Location**: `client/src/pages/Analytics.jsx`  
**Route**: `/analytics`  
**Access**: Private (both roles)

### Role-Specific Analytics

#### For DONOR Role:

1. **Total Listings**: All listings created
2. **Available**: Currently available listings
3. **Claimed**: Listings with accepted claims
4. **Completed**: Successfully completed listings
5. **Claims Received**:
   - Total claims received
   - Breakdown: Pending vs Accepted

#### For NGO Role:

1. **Available Listings**: Total in system
2. **Total Claims**: All claims made by NGO
3. **Accepted**: Approved claims
4. **Completed**: Successfully completed claims

### Interactive Map Feature

**Technology**: React-Leaflet with OpenStreetMap tiles

**Features**:

- **Map Display**: Shows all listings with coordinates
- **Markers**: Each listing location marked on map
- **Popup Information**: Click marker to see:
  - Listing title
  - Category
  - Quantity and unit
- **Auto-Centering**: Centers on first listing with coordinates
- **Zoom Level**: Default 10 (city-level view)

**Requirements**:

- Only displays listings with valid coordinates
- Requires `pickupLocation.coordinates.lat` and `pickupLocation.coordinates.lng`

---

## 🔐 Authentication & Authorization

### Protected Routes

- **PrivateRoute**: Ensures user is authenticated
- **RoleRoute**: Restricts access by role (DONOR/NGO)

### Route Structure

```
/login          → Public (Login page)
/register       → Public (Registration page)
/donor          → Private, DONOR only
/ngo            → Private, NGO only
/analytics      → Private, both roles
/               → Redirects to /login
```

---

## 🎨 UI/UX Features

### Design System

- **Theme**: Material-UI with custom green/orange palette
- **Gradients**: Multiple gradient combinations for visual appeal
- **Icons**: Material-UI icons throughout
- **Responsive**: Mobile-first design with breakpoints

### Visual Enhancements

1. **Hover Effects**: Cards lift on hover (translateY)
2. **Transitions**: Smooth animations (0.3s ease)
3. **Color Coding**: Status-based color system
4. **Glassmorphism**: Backdrop blur effects
5. **Shadows**: Layered box shadows for depth

### Empty States

- Friendly messages with large icons
- Call-to-action buttons
- Gradient backgrounds

### Loading States

- Circular progress indicators
- Skeleton screens (where applicable)

---

## ⚙️ Backend Integration

### API Endpoints Used

#### Listings

- `GET /api/listings/mine` - Donor's listings
- `GET /api/listings/available` - Available listings (NGO)
- `POST /api/listings` - Create listing
- `DELETE /api/listings/:id` - Delete listing

#### Claims

- `GET /api/claims/mine` - NGO's claims
- `GET /api/claims/received` - Donor's received claims
- `POST /api/claims` - Create claim
- `PATCH /api/claims/:id/accept` - Accept claim
- `PATCH /api/claims/:id/reject` - Reject claim
- `PATCH /api/claims/:id/complete` - Complete claim

### Data Flow

1. **Component Mount**: Fetches initial data via `useEffect`
2. **User Actions**: Triggers API calls with axios
3. **State Updates**: Updates local state on success
4. **Re-fetch**: Refreshes data after mutations

---

## 🔄 Real-Time Features

### Automated Expiry Handling

- **Cron Job**: Runs every 5 minutes
- **Function**: Marks expired listings as `EXPIRED`
- **Location**: `jobs/expireListings.js`
- **Effect**: Automatically rejects pending claims on expired listings

### Status Management

- **Listing Statuses**: AVAILABLE → CLAIMED → COMPLETED / EXPIRED
- **Claim Statuses**: PENDING → ACCEPTED/REJECTED → COMPLETED
- **State Synchronization**: Frontend and backend stay in sync

---

## 📱 Responsive Design

### Breakpoints

- **xs**: Mobile (< 600px)
- **sm**: Tablet (≥ 600px)
- **md**: Desktop (≥ 900px)
- **lg**: Large Desktop (≥ 1200px)

### Grid System

- **Statistics**: 4 columns on desktop, 2 on tablet, 1 on mobile
- **Listings Grid**: 2 columns on desktop, 1 on mobile
- **Flexible Layout**: Adapts to screen size

---

## 🚀 Performance Optimizations

1. **Lazy Loading**: Components loaded on demand
2. **Efficient Queries**: Indexed database queries
3. **Optimistic Updates**: Immediate UI feedback
4. **Error Handling**: Graceful error messages
5. **Loading States**: Prevents multiple submissions

---

## 🔮 Future Enhancements (Placeholders)

### Layout Component

- Profile page route (commented out)
- Settings page
- User preferences

### Potential Features

- Real-time notifications
- Email notifications
- Image upload for listings
- Advanced filtering and search
- Rating system
- Chat/messaging between donor and NGO
- Mobile app version

---

## 📝 Key Functionalities Summary

### Donor Capabilities

✅ Create food listings with detailed information  
✅ View all their listings with status tracking  
✅ Manage incoming claims (accept/reject/complete)  
✅ Delete available listings  
✅ View comprehensive statistics  
✅ Track claim history  
✅ Access analytics dashboard

### NGO Capabilities

✅ Browse all available food listings  
✅ View time remaining until expiry  
✅ Claim available food with optional message  
✅ Track claim status (pending/accepted/rejected/completed)  
✅ View donor contact information  
✅ Access analytics dashboard  
✅ See listings on interactive map

### Shared Features

✅ Role-based dashboard access  
✅ Analytics with statistics  
✅ Interactive map visualization  
✅ Responsive design  
✅ Modern, intuitive UI  
✅ Real-time status updates

---

## 🎯 Business Logic Highlights

1. **One Claim Per Listing**: Only one pending/accepted claim allowed per listing
2. **Automatic Rejection**: Accepting a claim auto-rejects other pending claims
3. **Expiry Protection**: Cannot claim expired listings
4. **Status Flow Control**: Enforced status transitions (e.g., only ACCEPTED can be COMPLETED)
5. **Ownership Validation**: Users can only manage their own listings/claims

---

This comprehensive dashboard system provides a complete solution for surplus food redistribution with intuitive interfaces for both donors and NGOs, real-time tracking, and powerful analytics capabilities.

