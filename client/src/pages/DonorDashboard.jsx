import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Delete,
  AccessTime,
  LocationOn,
  Restaurant,
  Inbox,
  TrendingUp,
  CheckCircle,
  Pending,
  MyLocation,
  QrCode,
  Verified,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [verificationDialog, setVerificationDialog] = useState({ open: false, claim: null, code: '' });
  const [locationLoading, setLocationLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const socketRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    quantity: 1,
    unit: 'servings',
    availableUntil: '',
    pickupLocation: { street: '', city: '', state: '', zipCode: '', coordinates: { lat: null, lng: null } },
    specialInstructions: '',
  });

  useEffect(() => {
    fetchListings();
    fetchClaims();

    // Set up Socket.io connection
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin.replace(':3000', ':5000') || 'http://localhost:5000';
    socketRef.current = io(apiUrl, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('claimAccepted', (data) => {
      // Update listings and claims in real-time
      fetchListings();
      fetchClaims();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchListings = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API}/api/listings/mine`);
      setListings(response.data.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API}/api/claims/received`);
      setClaims(response.data.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const availableUntil = new Date(formData.availableUntil);
      const availableFrom = new Date();

      await axios.post(`${API}/api/listings`, {
        ...formData,
        availableFrom: availableFrom.toISOString(),
        availableUntil: availableUntil.toISOString(),
      });

      setOpenDialog(false);
      setFormData({
        title: '',
        description: '',
        category: 'Other',
        quantity: 1,
        unit: 'servings',
        availableUntil: '',
        pickupLocation: { street: '', city: '', state: '', zipCode: '' },
        specialInstructions: '',
      });
      fetchListings();
      fetchClaims();
    } catch (error) {
      console.error('Error creating listing:', error);
      alert(error.response?.data?.message || 'Failed to create listing');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await axios.delete(`${API}/api/listings/${id}`);
      fetchListings();
      fetchClaims();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete listing');
    }
  };

  const handleClaimAction = async (claimId, action) => {
    try {
      let payload = {};
      
      if (action === 'reject') {
        const reason = window.prompt('Rejection reason (optional):');
        if (reason === null) return; // User cancelled
        payload = { rejectedReason: reason || 'Rejected by donor' };
      }
      
      const response = await axios.patch(`${API}/api/claims/${claimId}/${action}`, payload);
      
      // If accepting, show verification code
      if (action === 'accept' && response.data.verificationCode) {
        const claim = claims.find(c => c._id === claimId);
        setVerificationDialog({
          open: true,
          claim: { ...claim, verificationCode: response.data.verificationCode },
          code: response.data.verificationCode
        });
      }
      
      fetchClaims();
      fetchListings();
      if (action !== 'accept') {
        alert(`Claim ${action}ed successfully!`);
      }
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${action} claim`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'success',
      CLAIMED: 'info',
      EXPIRED: 'error',
      COMPLETED: 'default',
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Auto-fill location using Geolocation API
  const handleGetLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const address = data.address || {};
          setFormData(prev => ({
            ...prev,
            pickupLocation: {
              street: address.road || address.house_number ? `${address.house_number || ''} ${address.road || ''}`.trim() : '',
              city: address.city || address.town || address.village || '',
              state: address.state || address.region || '',
              zipCode: address.postcode || '',
              coordinates: { lat: latitude, lng: longitude }
            }
          }));
        } catch (error) {
          console.error('Error fetching address:', error);
          // Still set coordinates even if reverse geocoding fails
          setFormData(prev => ({
            ...prev,
            pickupLocation: {
              ...prev.pickupLocation,
              coordinates: { lat: latitude, lng: longitude }
            }
          }));
        }
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enter it manually.');
        setLocationLoading(false);
      }
    );
  };

  // Handle verification
  const handleVerifyPickup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }

    try {
      const response = await axios.post(`${API}/api/claims/${verificationDialog.claim._id}/verify`, {
        verificationCode: verificationCode
      });

      if (response.data.success) {
        alert('Pickup verified successfully!');
        setVerificationDialog({ open: false, claim: null, code: '' });
        setVerificationCode('');
        fetchListings();
        fetchClaims();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Verification failed');
    }
  };

  // Calculate time until pickup
  const getTimeUntilPickup = (claim) => {
    if (!claim.pickupTime) return null;
    const now = new Date();
    const pickup = new Date(claim.pickupTime);
    const diff = pickup - now;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 0) return 'Overdue';
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const pendingClaims = claims.filter((c) => c.status === 'PENDING');
  const activeClaims = claims.filter((c) => c.status === 'ACCEPTED');
  const completedClaims = claims.filter((c) => c.status === 'COMPLETED');
  const availableListings = listings.filter((l) => l.status === 'AVAILABLE');

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
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Welcome back, {user?.name || 'Donor'}! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage your food listings and claims
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Create Listing
          </Button>
        </Box>
      </Box>

      {/* Active Listings Card */}
      {availableListings.length > 0 && (
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '2px solid #43e97b',
          }}
        >
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              🍽️ Active Listings
            </Typography>
            <Grid container spacing={2}>
              {availableListings.map((listing) => {
                const claim = claims.find(
                  (c) => c.listing?._id === listing._id && c.status === 'ACCEPTED'
                );
                return (
                  <Grid item xs={12} md={6} key={listing._id}>
                    <Card
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: claim
                          ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
                          : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                        border: claim ? '2px solid #ff9800' : '2px solid #43e97b',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {listing.title}
                        </Typography>
                        <Chip
                          label={claim ? 'Claimed' : 'Available'}
                          color={claim ? 'warning' : 'success'}
                          size="small"
                        />
                      </Box>
                      {claim && (
                        <Alert
                          severity="info"
                          sx={{
                            mt: 1,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Claimed by:</strong> {claim.ngo?.organization || claim.ngo?.name || 'NGO'}
                            {claim.pickupTime && (
                              <> • <strong>Pickup in:</strong> {getTimeUntilPickup(claim)}</>
                            )}
                          </Typography>
                        </Alert>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

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
                    Total Listings
                  </Typography>
                </Box>
                <Restaurant sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {availableListings.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Available Now
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
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
                <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
          },
          '& .Mui-selected': {
            color: '#667eea',
          },
        }}
        indicatorColor="primary"
      >
        <Tab label={`My Listings (${listings.length})`} />
        <Tab
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <Inbox />
              Claims Received
              {pendingClaims.length > 0 && (
                <Chip
                  label={pendingClaims.length}
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
          }
        />
      </Tabs>

      {tabValue === 1 && (
        <Box>
          {claims.length === 0 ? (
            <Card
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f5f7fb 0%, #e8f5e9 100%)',
                borderRadius: 3,
              }}
            >
              <Inbox sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No claims received yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                When NGOs claim your listings, they'll appear here
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
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
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">
                          {claim.listing?.title || 'Food Listing'}
                        </Typography>
                        <Chip
                          label={claim.status}
                          color={getStatusColor(claim.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        From: {claim.ngo?.name || 'NGO'} ({claim.ngo?.organization || 'N/A'})
                      </Typography>
                      {claim.ngo?.phone && (
                        <Typography variant="body2">Phone: {claim.ngo.phone}</Typography>
                      )}
                      {claim.message && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Message: {claim.message}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Quantity: {claim.listing?.quantity} {claim.listing?.unit}
                      </Typography>
                      {claim.status === 'PENDING' && (
                        <Box mt={2} display="flex" gap={2}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleClaimAction(claim._id, 'accept')}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleClaimAction(claim._id, 'reject')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {claim.status === 'ACCEPTED' && (
                        <Box mt={2} display="flex" gap={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<QrCode />}
                            onClick={() => {
                              setVerificationDialog({ open: true, claim, code: claim.verificationCode || '' });
                            }}
                          >
                            Verify Pickup
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleClaimAction(claim._id, 'complete')}
                          >
                            Mark as Completed
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {tabValue === 0 && (
        <>
          {listings.length === 0 && !loading ? (
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
                No listings yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Create your first food listing to help reduce food waste!
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              >
                Create Your First Listing
              </Button>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {listings.map((listing) => (
                <Grid item xs={12} md={6} key={listing._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      border: listing.status === 'AVAILABLE' ? '2px solid #43e97b' : 'none',
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
                        <Chip
                          label={listing.status}
                          color={getStatusColor(listing.status)}
                          size="small"
                          sx={{ fontWeight: 600, ml: 1 }}
                        />
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
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <AccessTime sx={{ verticalAlign: 'middle', mr: 1, color: '#f5576c' }} />
                          Expires: {formatDate(listing.availableUntil)}
                        </Typography>
                        {listing.pickupLocation?.city && (
                          <Typography variant="body2">
                            <LocationOn sx={{ verticalAlign: 'middle', mr: 1, color: '#4facfe' }} />
                            {listing.pickupLocation.city}, {listing.pickupLocation.state}
                          </Typography>
                        )}
                      </Box>
                      {listing.claimedBy && (
                        <Alert
                          severity="info"
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)',
                          }}
                        >
                          <strong>Claimed by:</strong> {listing.claimedBy?.name || 'NGO'}
                        </Alert>
                      )}
                      <Box mt={2} display="flex" justifyContent="flex-end">
                        {listing.status === 'AVAILABLE' && (
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(listing._id)}
                            sx={{
                              '&:hover': {
                                background: 'rgba(244, 67, 54, 0.1)',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
          )}
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            Create New Food Listing
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="Bakery">Bakery</MenuItem>
                  <MenuItem value="Main Course">Main Course</MenuItem>
                  <MenuItem value="Salads">Salads</MenuItem>
                  <MenuItem value="Desserts">Desserts</MenuItem>
                  <MenuItem value="Beverages">Beverages</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  label="Unit"
                  fullWidth
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <MenuItem value="servings">Servings</MenuItem>
                  <MenuItem value="packages">Packages</MenuItem>
                  <MenuItem value="items">Items</MenuItem>
                  <MenuItem value="kg">Kg</MenuItem>
                  <MenuItem value="liters">Liters</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField
              margin="dense"
              label="Available Until"
              type="datetime-local"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.availableUntil}
              onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={locationLoading ? <CircularProgress size={20} /> : <MyLocation />}
                onClick={handleGetLocation}
                disabled={locationLoading}
                sx={{ borderRadius: 2 }}
              >
                {locationLoading ? 'Getting Location...' : 'Auto-Fill Location'}
              </Button>
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  fullWidth
                  value={formData.pickupLocation.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupLocation: { ...formData.pickupLocation, street: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="City"
                  fullWidth
                  value={formData.pickupLocation.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupLocation: { ...formData.pickupLocation, city: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="State"
                  fullWidth
                  value={formData.pickupLocation.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupLocation: { ...formData.pickupLocation, state: e.target.value },
                    })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Zip Code"
                  fullWidth
                  value={formData.pickupLocation.zipCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupLocation: { ...formData.pickupLocation, zipCode: e.target.value },
                    })
                  }
                />
              </Grid>
            </Grid>
            <TextField
              margin="dense"
              label="Special Instructions"
              fullWidth
              multiline
              rows={2}
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={verificationDialog.open}
        onClose={() => {
          setVerificationDialog({ open: false, claim: null, code: '' });
          setVerificationCode('');
        }}
        maxWidth="sm"
        fullWidth
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
          Verify Pickup
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {verificationDialog.claim && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {verificationDialog.claim.listing?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Claimed by: {verificationDialog.claim.ngo?.organization || verificationDialog.claim.ngo?.name}
              </Typography>

              {verificationDialog.code && (
                <Box sx={{ my: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Verification Code (Share with NGO):
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 3,
                      my: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        border: '2px solid #667eea',
                        borderRadius: 2,
                        background: '#f5f5f5',
                      }}
                    >
                      <QRCodeSVG value={verificationDialog.code} size={150} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          letterSpacing: 2,
                          color: '#667eea',
                          fontFamily: 'monospace',
                        }}
                      >
                        {verificationDialog.code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Enter this code when NGO arrives
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              <TextField
                margin="dense"
                label="Enter Verification Code"
                fullWidth
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                inputProps={{
                  maxLength: 6,
                  style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: 4, fontFamily: 'monospace' },
                }}
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Ask the NGO representative to provide the 6-digit code or scan the QR code
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setVerificationDialog({ open: false, claim: null, code: '' });
              setVerificationCode('');
            }}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleVerifyPickup}
            disabled={verificationCode.length !== 6}
            startIcon={<Verified />}
            sx={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
              },
            }}
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonorDashboard;

