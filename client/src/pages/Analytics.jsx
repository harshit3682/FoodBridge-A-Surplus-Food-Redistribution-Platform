import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Restaurant,
  CheckCircle,
  AccessTime,
  TrendingUp,
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

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      if (user?.role === 'DONOR') {
        const [listingsRes, claimsRes] = await Promise.all([
          axios.get('/api/listings/mine'),
          axios.get('/api/claims/received'),
        ]);

        const myListings = listingsRes.data.data;
        const myClaims = claimsRes.data.data;
        setListings(myListings);

        const statsData = {
          totalListings: myListings.length,
          availableListings: myListings.filter((l) => l.status === 'AVAILABLE').length,
          claimedListings: myListings.filter((l) => l.status === 'CLAIMED').length,
          completedListings: myListings.filter((l) => l.status === 'COMPLETED').length,
          expiredListings: myListings.filter((l) => l.status === 'EXPIRED').length,
          totalClaims: myClaims.length,
          pendingClaims: myClaims.filter((c) => c.status === 'PENDING').length,
          acceptedClaims: myClaims.filter((c) => c.status === 'ACCEPTED').length,
        };
        setStats(statsData);
      } else {
        const [listingsRes, claimsRes] = await Promise.all([
          axios.get('/api/listings/available'),
          axios.get('/api/claims/mine'),
        ]);

        const availableListings = listingsRes.data.data;
        const myClaims = claimsRes.data.data;
        setListings(availableListings);

        const statsData = {
          availableListings: availableListings.length,
          totalClaims: myClaims.length,
          pendingClaims: myClaims.filter((c) => c.status === 'PENDING').length,
          acceptedClaims: myClaims.filter((c) => c.status === 'ACCEPTED').length,
          completedClaims: myClaims.filter((c) => c.status === 'COMPLETED').length,
          rejectedClaims: myClaims.filter((c) => c.status === 'REJECTED').length,
        };
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Alert severity="info">No analytics data available</Alert>;
  }

  // Get listings with coordinates for map
  const listingsWithCoords = listings.filter(
    (l) => l.pickupLocation?.coordinates?.lat && l.pickupLocation?.coordinates?.lng
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {user?.role === 'DONOR' ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Restaurant sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{stats.totalListings}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Listings
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{stats.availableListings}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircle sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{stats.claimedListings}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Claimed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <AccessTime sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{stats.completedListings}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Claims Received
                  </Typography>
                  <Typography variant="h4">{stats.totalClaims}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending: {stats.pendingClaims} • Accepted: {stats.acceptedClaims}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Restaurant sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{stats.availableListings}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available Listings
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{stats.totalClaims}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Claims
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircle sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{stats.acceptedClaims}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accepted
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <AccessTime sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{stats.completedClaims}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {listingsWithCoords.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Food Listings Map
                </Typography>
                <Box sx={{ height: '400px', width: '100%', mt: 2 }}>
                  <MapContainer
                    center={[
                      listingsWithCoords[0].pickupLocation.coordinates.lat,
                      listingsWithCoords[0].pickupLocation.coordinates.lng,
                    ]}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {listingsWithCoords.map((listing) => (
                      <Marker
                        key={listing._id}
                        position={[
                          listing.pickupLocation.coordinates.lat,
                          listing.pickupLocation.coordinates.lng,
                        ]}
                      >
                        <Popup>
                          <Typography variant="subtitle2">{listing.title}</Typography>
                          <Typography variant="body2">{listing.category}</Typography>
                          <Typography variant="body2">
                            {listing.quantity} {listing.unit}
                          </Typography>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Analytics;



