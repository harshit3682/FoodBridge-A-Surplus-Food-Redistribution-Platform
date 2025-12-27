# 🗺️ NGO Dashboard Features

## Overview

Enhanced NGO Dashboard with Rescue Map, advanced filtering, sorting, and navigation features to help NGOs quickly discover and claim food donations.

---

## 1. 🗺️ Rescue Map (Core Feature)

### Feature Description

Interactive map using Leaflet showing all available food listings with color-coded pins based on freshness and urgency.

### Implementation

- **Map Integration**: Uses React-Leaflet with OpenStreetMap tiles
- **Color-Coded Pins**:
  - 🟢 **Green Pin**: Fresh listings (< 2 hours old)
  - 🔴 **Red Pin**: Expiring soon (< 30 minutes remaining)
  - 🔵 **Blue Pin**: Other available listings
- **User Location**: Shows NGO's current location (if permission granted)
- **Interactive Popups**: Click pins to see listing details and claim directly
- **Distance Display**: Shows distance from user location in popup

### Map Features

- **Zoom Controls**: Standard Leaflet zoom controls
- **Marker Clustering**: Visual grouping of nearby listings
- **Legend**: Color-coded legend explaining pin colors
- **Responsive**: Adapts to different screen sizes

### Code Location

- `client/src/pages/NGODashboard.jsx` - Map view implementation

---

## 2. 📋 List View with Filters

### Feature Description

Comprehensive list view with sorting and filtering options to help NGOs find the most relevant food donations quickly.

### Sorting Options

1. **Expiring Soonest** (Default)

   - Sorts by `availableUntil` date (ascending)
   - Prioritizes urgent listings

2. **Closest Distance**

   - Calculates distance using Haversine formula
   - Requires user location permission
   - Shows distance in km on each listing card

3. **Largest Quantity**
   - Sorts by `quantity` field (descending)
   - Helps find bulk donations

### Filter Options

- **Veg Only Toggle**
  - Filters listings that are vegetarian
  - Checks:
    - Category = "Salads"
    - Description contains "vegetarian" or "veg"
  - Important for cultural/dietary requirements

### UI Components

- **View Toggle**: Switch between Map and List view
- **Sort Dropdown**: Select sorting preference
- **Filter Switch**: Toggle vegetarian filter
- **Get Location Button**: Request location permission for distance sorting

### Code Location

- `client/src/pages/NGODashboard.jsx` - `applyFiltersAndSort()` function

---

## 3. 🧭 Get Directions Feature

### Feature Description

One-click navigation to pickup locations using Google Maps integration.

### Implementation

- **Button Location**: "Get Directions" button in "My Claims" section
- **Google Maps Integration**: Opens Google Maps with route to destination
- **Smart Routing**:
  - Uses coordinates if available (more accurate)
  - Falls back to address if coordinates missing
- **Only for Accepted Claims**: Button appears only for ACCEPTED status claims

### User Experience

1. NGO views their accepted claims
2. Clicks "Get Directions" button
3. Google Maps opens in new tab
4. Route is automatically calculated
5. Can navigate using Google Maps app on mobile

### Code Location

- `client/src/pages/NGODashboard.jsx` - `getDirections()` function

---

## 🎨 UI Enhancements

### View Mode Toggle

- **Map Icon**: Switch to map view
- **List Icon**: Switch to list view
- **Active State**: Visual indication of current view

### Distance Display

- **In List View**: Shows distance chip on listing cards
- **In Map Popup**: Shows distance in popup
- **Format**: "X.X km" (1 decimal place)

### Status Indicators

- **Color-Coded Badges**: Claim status with color coding
- **Time Remaining**: Bold red text for urgency
- **Distance Chips**: Blue chips showing distance

---

## 📐 Distance Calculation

### Haversine Formula

Calculates great-circle distance between two points on Earth:

```javascript
const R = 6371; // Earth radius in km
const dLat = (lat2 - lat1) * π / 180;
const dLon = (lon2 - lon1) * π / 180;
const a = sin²(dLat/2) + cos(lat1) * cos(lat2) * sin²(dLon/2);
const c = 2 * atan2(√a, √(1-a));
const distance = R * c;
```

### Accuracy

- Accurate for distances up to ~1000 km
- Accounts for Earth's curvature
- Returns distance in kilometers

---

## 🔄 Real-Time Features

### Location Updates

- **Auto-Request**: Requests location on component mount
- **Permission Handling**: Graceful fallback if denied
- **Re-Request Button**: Manual location request button

### Filter/Sort Updates

- **Automatic**: Re-applies filters when data changes
- **Preserves State**: Maintains filter/sort preferences
- **Instant**: No page refresh needed

---

## 🎯 User Workflows

### Finding Food (Map View)

1. NGO opens dashboard
2. Sees map with color-coded pins
3. Clicks pin to see details
4. Claims food directly from popup
5. Sees real-time updates

### Finding Food (List View)

1. NGO switches to list view
2. Applies filters (e.g., Veg Only)
3. Sorts by preference (e.g., Closest)
4. Views sorted listings
5. Claims desired food

### Getting to Pickup

1. NGO views "My Claims"
2. Finds accepted claim
3. Clicks "Get Directions"
4. Google Maps opens with route
5. Navigates to pickup location

---

## 🛡️ Error Handling

### Location Errors

- **Permission Denied**: Shows "Get Location" button
- **Location Unavailable**: Falls back to address-based sorting
- **Timeout**: Graceful error message

### Map Errors

- **No Coordinates**: Shows message instead of map
- **Invalid Coordinates**: Skips invalid listings
- **Network Error**: Handles tile loading failures

### Filter Errors

- **No Results**: Shows empty state message
- **Invalid Sort**: Falls back to default sort
- **Missing Data**: Handles missing fields gracefully

---

## 📱 Mobile Optimization

### Responsive Design

- **Map Height**: 500px on desktop, adjusts on mobile
- **Touch-Friendly**: Large tap targets for mobile
- **Swipe Support**: Map panning works on touch devices

### Mobile-Specific Features

- **Google Maps App**: "Get Directions" opens in Maps app on mobile
- **Location Services**: Uses device GPS for accuracy
- **Offline Support**: Map tiles cached for offline viewing

---

## 🔮 Future Enhancements

### Potential Additions

1. **Route Optimization**: Multi-stop route planning
2. **Notifications**: Push notifications for new listings
3. **Favorites**: Save frequently visited locations
4. **History**: Track past pickups and routes
5. **Offline Maps**: Download maps for offline use
6. **Traffic Integration**: Real-time traffic data
7. **ETA Calculation**: Estimated arrival time
8. **Batch Claims**: Claim multiple listings at once

---

## 📝 Technical Details

### Dependencies Used

- `react-leaflet`: Map component library
- `leaflet`: Core mapping library
- Browser Geolocation API: User location
- Google Maps API: Directions (via URL)

### Performance

- **Lazy Loading**: Map loads only when needed
- **Marker Optimization**: Efficient marker rendering
- **Filter Caching**: Cached filter results
- **Debounced Sorting**: Prevents excessive re-renders

---

## 🧪 Testing Checklist

- [ ] Map displays correctly with listings
- [ ] Color coding works (green/red/blue)
- [ ] User location marker appears
- [ ] Distance calculation is accurate
- [ ] Sorting works for all options
- [ ] Veg filter filters correctly
- [ ] Get Directions opens Google Maps
- [ ] View toggle switches correctly
- [ ] Mobile responsiveness
- [ ] Error states display properly

---

## 🚀 Usage Examples

### Example 1: Finding Closest Food

1. Click "Get Location" button
2. Select "Closest Distance" from sort dropdown
3. View listings sorted by proximity
4. Claim nearest available food

### Example 2: Finding Urgent Food

1. Switch to Map view
2. Look for red pins (expiring soon)
3. Click red pin to see details
4. Claim urgent listing

### Example 3: Vegetarian Filter

1. Toggle "Veg Only" switch
2. View only vegetarian listings
3. Sort by preference
4. Claim suitable food

### Example 4: Navigation

1. Go to "My Claims" section
2. Find accepted claim
3. Click "Get Directions"
4. Follow route in Google Maps

---

All features are now fully integrated and ready to use! 🎉

