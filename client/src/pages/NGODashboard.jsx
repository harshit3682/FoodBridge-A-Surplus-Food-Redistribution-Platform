import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  AccessTime,
  LocationOn,
  Restaurant,
  ShoppingCart,
  LocalOffer,
  Pending,
  Assignment,
  Map,
  List,
  Sort,
  Directions,
  FilterList,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const NGODashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimDialog, setClaimDialog] = useState({ open: false, listing: null });
  const [claimMessage, setClaimMessage] = useState('');
  const [viewMode, setViewMode] = useState(0); // 0 = Map, 1 = List
  const [sortBy, setSortBy] = useState('expiringSoonest');
  const [vegOnly, setVegOnly] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetchAvailableListings();
    fetchMyClaims();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [listings, sortBy, vegOnly, userLocation]);

  const getUserLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
        }
      );
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Get pin color based on freshness/expiry
  const getPinColor = (listing) => {
    const now = new Date();
    const createdAt = new Date(listing.createdAt);
    const expiresAt = new Date(listing.availableUntil);
    
    const ageInHours = (now - createdAt) / (1000 * 60 * 60);
    const timeUntilExpiry = (expiresAt - now) / (1000 * 60);
    
    // Red = Expiring soon (< 30 mins)
    if (timeUntilExpiry < 30 && timeUntilExpiry > 0) {
      return 'red';
    }
    // Green = Fresh (< 2 hrs old)
    if (ageInHours < 2) {
      return 'green';
    }
    // Default blue
    return 'blue';
  };

  // Create custom icon for map markers
  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 25],
    });
  };

  const applyFiltersAndSort = () => {
    let filtered = [...listings];

    // Filter: Veg Only
    if (vegOnly) {
      filtered = filtered.filter(
        (listing) =>
          listing.category === 'Salads' ||
          listing.description?.toLowerCase().includes('vegetarian') ||
          listing.description?.toLowerCase().includes('veg')
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'closestDistance':
          if (!userLocation) return 0;
          const aCoords = a.pickupLocation?.coordinates;
          const bCoords = b.pickupLocation?.coordinates;
          if (!aCoords || !aCoords.lat) return 1;
          if (!bCoords || !bCoords.lat) return -1;
          const distA = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            aCoords.lat,
            aCoords.lng
          );
          const distB = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            bCoords.lat,
            bCoords.lng
          );
          return distA - distB;

        case 'largestQuantity':
          return b.quantity - a.quantity;

        case 'expiringSoonest':
        default:
          const aExpiry = new Date(a.availableUntil).getTime();
          const bExpiry = new Date(b.availableUntil).getTime();
          return aExpiry - bExpiry;
      }
    });

    setFilteredListings(filtered);
  };

  const getDirections = (listing) => {
    const coords = listing.pickupLocation?.coordinates;
    if (coords && coords.lat && coords.lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
      window.open(url, '_blank');
    } else {
      // Fallback to address-based directions
      const address = `${listing.pickupLocation?.street || ''}, ${listing.pickupLocation?.city || ''}, ${listing.pickupLocation?.state || ''}`.trim();
      if (address) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
      } else {
        alert('Location information not available');
      }
    }
  };

  const fetchAvailableListings = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API}/api/listings/available`);
      setListings(response.data.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClaims = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API}/api/claims/mine`);
      setClaims(response.data.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const handleClaim = async () => {
    try {
      await axios.post(`${API}/api/claims`, {
        listingId: claimDialog.listing._id,
        message: claimMessage,
      });
      setClaimDialog({ open: false, listing: null });
      setClaimMessage('');
      fetchAvailableListings();
      fetchMyClaims();
      alert('Claim submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit claim');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (dateString) => {
    const now = new Date();
    const expiry = new Date(dateString);
    const diff = expiry - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) return 'Expired';
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      ACCEPTED: 'success',
      REJECTED: 'error',
      COMPLETED: 'default',
    };
    return colors[status] || 'default';
  };

  // Get claimed listing IDs
  const claimedListingIds = claims
    .filter((c) => c.status === 'PENDING' || c.status === 'ACCEPTED')
    .map((c) => c.listing._id || c.listing);

  const pendingClaims = claims.filter((c) => c.status === 'PENDING');
  const acceptedClaims = claims.filter((c) => c.status === 'ACCEPTED');
  const completedClaims = claims.filter((c) => c.status === 'COMPLETED');

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 3,
          color: 'white',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Welcome, {user?.name || 'NGO'}! 👋
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Browse available food listings and manage your claims
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {listings.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Available Listings
                  </Typography>
                </Box>
                <LocalOffer sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {pendingClaims.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pending Claims
                  </Typography>
                </Box>
                <Pending sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {acceptedClaims.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Accepted Claims
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(67, 233, 123, 0.3)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {completedClaims.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Completed
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Available Food Listings
        </Typography>
        
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          {/* View Mode Toggle */}
          <Tabs
            value={viewMode}
            onChange={(e, newValue) => setViewMode(newValue)}
            sx={{ minHeight: 'auto' }}
          >
            <Tab icon={<Map />} label="Map" sx={{ minHeight: 'auto', py: 1 }} />
            <Tab icon={<List />} label="List" sx={{ minHeight: 'auto', py: 1 }} />
          </Tabs>

          {/* Sort Dropdown */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              startAdornment={<Sort sx={{ mr: 1, fontSize: 18 }} />}
            >
              <MenuItem value="expiringSoonest">Expiring Soonest</MenuItem>
              <MenuItem value="closestDistance">Closest Distance</MenuItem>
              <MenuItem value="largestQuantity">Largest Quantity</MenuItem>
            </Select>
          </FormControl>

          {/* Veg Only Filter */}
          <FormControlLabel
            control={
              <Switch
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                color="success"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                <FilterList fontSize="small" />
                <span>Veg Only</span>
              </Box>
            }
          />

          {/* Get Location Button */}
          {!userLocation && (
            <Tooltip title="Get your location for distance sorting">
              <Button
                variant="outlined"
                size="small"
                startIcon={locationLoading ? <CircularProgress size={16} /> : <LocationOn />}
                onClick={getUserLocation}
                disabled={locationLoading}
              >
                {locationLoading ? 'Getting...' : 'Get Location'}
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : filteredListings.length === 0 ? (
        <Card
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fb 0%, #e8f5e9 100%)',
            borderRadius: 3,
          }}
        >
          <Restaurant sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No available listings at the moment
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for new food donations
          </Typography>
        </Card>
      ) : viewMode === 0 ? (
        // Map View
        <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ height: '500px', width: '100%', position: 'relative' }}>
            {filteredListings.filter(l => l.pickupLocation?.coordinates?.lat && l.pickupLocation?.coordinates?.lng).length > 0 ? (
              <MapContainer
                center={
                  userLocation
                    ? [userLocation.lat, userLocation.lng]
                    : filteredListings.find(l => l.pickupLocation?.coordinates?.lat)
                    ? [
                        filteredListings.find(l => l.pickupLocation?.coordinates?.lat).pickupLocation.coordinates.lat,
                        filteredListings.find(l => l.pickupLocation?.coordinates?.lat).pickupLocation.coordinates.lng,
                      ]
                    : [0, 0]
                }
                zoom={userLocation ? 12 : 10}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* User Location Marker */}
                {userLocation && (
                  <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.divIcon({
                      className: 'user-location-marker',
                      html: `<div style="
                        background-color: #667eea;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                      "></div>`,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10],
                    })}
                  >
                    <Popup>Your Location</Popup>
                  </Marker>
                )}
                {/* Food Listing Markers */}
                {filteredListings
                  .filter((listing) => listing.pickupLocation?.coordinates?.lat && listing.pickupLocation?.coordinates?.lng)
                  .map((listing) => {
                    const isClaimed = claimedListingIds.includes(listing._id);
                    const pinColor = getPinColor(listing);
                    const distance = userLocation
                      ? calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          listing.pickupLocation.coordinates.lat,
                          listing.pickupLocation.coordinates.lng
                        ).toFixed(1)
                      : null;

                    return (
                      <Marker
                        key={listing._id}
                        position={[
                          listing.pickupLocation.coordinates.lat,
                          listing.pickupLocation.coordinates.lng,
                        ]}
                        icon={createCustomIcon(pinColor)}
                      >
                        <Popup>
                          <Box sx={{ minWidth: 200 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                              {listing.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {listing.category} • {listing.quantity} {listing.unit}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#f5576c' }}>
                              {getTimeRemaining(listing.availableUntil)}
                            </Typography>
                            {distance && (
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                📍 {distance} km away
                              </Typography>
                            )}
                            {!isClaimed && (
                              <Button
                                size="small"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 1 }}
                                onClick={() => setClaimDialog({ open: true, listing })}
                              >
                                Claim Food
                              </Button>
                            )}
                          </Box>
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Map sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No listings with location data
                </Typography>
              </Box>
            )}
          </Box>
          {/* Legend */}
          <Box sx={{ p: 2, background: '#f5f5f5', display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#43e97b',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
              <Typography variant="caption">Fresh (&lt; 2 hrs old)</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#f5576c',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
              <Typography variant="caption">Expiring Soon (&lt; 30 mins)</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#4facfe',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
              <Typography variant="caption">Other</Typography>
            </Box>
          </Box>
        </Card>
      ) : (
        // List View
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {filteredListings.map((listing) => {
            const isClaimed = claimedListingIds.includes(listing._id);
            const myClaim = claims.find(
              (c) => (c.listing._id || c.listing) === listing._id
            );

            return (
              <Grid item xs={12} md={6} key={listing._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    border: !isClaimed ? '2px solid #43e97b' : 'none',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {listing.title}
                      </Typography>
                      {isClaimed && (
                        <Chip
                          label={myClaim?.status || 'Claimed'}
                          color={getStatusColor(myClaim?.status)}
                          size="small"
                          sx={{ fontWeight: 600, ml: 1 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                      {listing.description}
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #f5f7fb 0%, #e8f5e9 100%)',
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <Restaurant sx={{ verticalAlign: 'middle', mr: 1, color: '#667eea' }} />
                        <strong>{listing.quantity}</strong> {listing.unit} • {listing.category}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, color: '#f5576c', fontWeight: 'bold' }}
                      >
                        <AccessTime sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {getTimeRemaining(listing.availableUntil)}
                      </Typography>
                      {listing.pickupLocation?.city && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <LocationOn sx={{ verticalAlign: 'middle', mr: 1, color: '#4facfe' }} />
                          {listing.pickupLocation.city}, {listing.pickupLocation.state}
                          {userLocation &&
                            listing.pickupLocation?.coordinates?.lat &&
                            listing.pickupLocation?.coordinates?.lng && (
                              <Chip
                                label={`${calculateDistance(
                                  userLocation.lat,
                                  userLocation.lng,
                                  listing.pickupLocation.coordinates.lat,
                                  listing.pickupLocation.coordinates.lng
                                ).toFixed(1)} km`}
                                size="small"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                color="primary"
                              />
                            )}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        <strong>Donor:</strong> {listing.donor?.name || 'N/A'}
                      </Typography>
                      {listing.donor?.phone && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Contact:</strong> {listing.donor.phone}
                        </Typography>
                      )}
                    </Box>
                    {myClaim && (
                      <Alert
                        severity={myClaim.status === 'ACCEPTED' ? 'success' : 'info'}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          background:
                            myClaim.status === 'ACCEPTED'
                              ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
                              : 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)',
                        }}
                      >
                        <strong>Your claim status:</strong> {myClaim.status}
                        {myClaim.rejectedReason && (
                          <Box sx={{ mt: 1 }}>
                            <strong>Reason:</strong> {myClaim.rejectedReason}
                          </Box>
                        )}
                      </Alert>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    {!isClaimed && (
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => setClaimDialog({ open: true, listing })}
                        fullWidth
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Claim Food
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box mt={4}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          My Claims
        </Typography>
        {claims.length === 0 ? (
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f5f7fb 0%, #e8f5e9 100%)',
              borderRadius: 3,
            }}
          >
            <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              You haven't made any claims yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Start claiming food listings above to help those in need
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {claims.map((claim) => (
              <Grid item xs={12} md={6} key={claim._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {claim.listing?.title || 'Food Listing'}
                      </Typography>
                      <Chip
                        label={claim.status}
                        color={getStatusColor(claim.status)}
                        size="small"
                        sx={{ fontWeight: 600, ml: 1 }}
                      />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #f5f7fb 0%, #e8f5e9 100%)',
                      }}
                    >
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Donor:</strong> {claim.listing?.donor?.name || 'N/A'}
                      </Typography>
                      {claim.listing?.pickupLocation && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <LocationOn sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 16 }} />
                          {claim.listing.pickupLocation.street && `${claim.listing.pickupLocation.street}, `}
                          {claim.listing.pickupLocation.city}, {claim.listing.pickupLocation.state}
                        </Typography>
                      )}
                      {claim.message && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Message:</strong> {claim.message}
                        </Typography>
                      )}
                      {claim.status === 'ACCEPTED' && claim.listing?.pickupLocation && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Directions />}
                          onClick={() => getDirections(claim.listing)}
                          sx={{
                            mt: 2,
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
                            },
                          }}
                        >
                          Get Directions
                        </Button>
                      )}
                    </Box>
                    {claim.rejectedReason && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                        }}
                      >
                        <strong>Rejection Reason:</strong> {claim.rejectedReason}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog
        open={claimDialog.open}
        onClose={() => setClaimDialog({ open: false, listing: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Claim Food Listing
        </DialogTitle>
        <DialogContent>
          {claimDialog.listing && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {claimDialog.listing.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {claimDialog.listing.description}
              </Typography>
              <TextField
                margin="dense"
                label="Message (Optional)"
                fullWidth
                multiline
                rows={3}
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setClaimDialog({ open: false, listing: null })}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleClaim}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NGODashboard;



