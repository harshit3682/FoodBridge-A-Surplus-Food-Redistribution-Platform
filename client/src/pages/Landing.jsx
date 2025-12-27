import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Restaurant,
  LocalDining,
  VolunteerActivism,
  TrendingUp,
  CheckCircle,
  ArrowForward,
  People,
  Favorite,
  Speed,
  Security,
} from '@mui/icons-material';
import axios from 'axios';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState({
    totalFoodSaved: 0,
    mealsProvided: 0,
    totalListings: 0,
    totalCompleted: 0,
    totalDonors: 0,
    totalNGOs: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/public');
      if (response.data.success) {
        setStats(response.data.data);
        setRecentDonations(response.data.data.recentDonations || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values if API fails
      setStats({
        totalFoodSaved: 1250,
        mealsProvided: 500,
        totalListings: 0,
        totalCompleted: 0,
        totalDonors: 0,
        totalNGOs: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Animated counter component
  const AnimatedCounter = ({ value, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentCount = Math.floor(progress * value);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(animate);
    }, [value, duration]);

    return (
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {count.toLocaleString()}
        {suffix}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fb 0%, #e8f5e9 50%, #fff3e0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Navigation Bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Restaurant sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                RescueRoute
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 8, md: 12 },
            px: { xs: 2, sm: 0 },
          }}
        >
          <Chip
            label="🌱 Fighting Food Waste, One Meal at a Time"
            sx={{
              mb: 3,
              py: 2,
              px: 1,
              fontSize: '0.9rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
              color: '#2e7d32',
            }}
          />
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            sx={{
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
            }}
          >
            Bridging the Gap Between
            <br />
            Surplus and Scarcity
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 5,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            Connect restaurants, bakeries, and event venues with NGOs and shelters
            to redistribute surplus food before it expires. Together, we're reducing
            waste and feeding communities.
          </Typography>

          <Box
            display="flex"
            gap={3}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mb: 8 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Restaurant />}
              onClick={() => navigate('/register?role=DONOR')}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 4,
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              I have Food (Donor)
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<VolunteerActivism />}
              onClick={() => navigate('/register?role=NGO')}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 4,
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                boxShadow: '0 8px 30px rgba(67, 233, 123, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(67, 233, 123, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              I need Food (NGO)
            </Button>
          </Box>
        </Box>

        {/* Live Impact Counter */}
        <Box
          sx={{
            mb: 10,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: 6,
            p: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Our Impact in Real-Time
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Favorite sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <AnimatedCounter
                  value={loading ? 0 : stats.totalFoodSaved}
                  suffix=" kg"
                />
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                  Total Food Saved
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <LocalDining sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <AnimatedCounter
                  value={loading ? 0 : stats.mealsProvided}
                  suffix=""
                />
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                  Meals Provided
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <People sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <AnimatedCounter
                  value={loading ? 0 : stats.totalDonors + stats.totalNGOs}
                  suffix=""
                />
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                  Active Users
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(67, 233, 123, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CheckCircle sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <AnimatedCounter
                  value={loading ? 0 : stats.totalCompleted}
                  suffix=""
                />
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                  Successful Donations
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* How It Works */}
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Three simple steps to make a difference
          </Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  border: '2px solid',
                  borderColor: 'rgba(102, 126, 234, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <Restaurant sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Post
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Donors create listings with food details, quantity, expiry time,
                  and pickup location. It takes less than 2 minutes!
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.05) 0%, rgba(56, 249, 215, 0.05) 100%)',
                  border: '2px solid',
                  borderColor: 'rgba(67, 233, 123, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(67, 233, 123, 0.2)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  }}
                >
                  <VolunteerActivism sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Claim
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  NGOs browse available listings, view details, and claim food
                  that matches their needs. Donors review and accept claims.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.05) 0%, rgba(240, 147, 251, 0.05) 100%)',
                  border: '2px solid',
                  borderColor: 'rgba(245, 87, 108, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(245, 87, 108, 0.2)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  }}
                >
                  <CheckCircle sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Pickup
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  NGOs pick up the food at the specified location and time.
                  Food is redistributed to those in need, reducing waste!
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Arrow connectors (desktop only) */}
          {!isMobile && (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                mb: 4,
              }}
            >
              <ArrowForward sx={{ fontSize: 40, color: 'primary.main' }} />
              <ArrowForward sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          )}
        </Box>

        {/* Recent Donations Ticker */}
        {recentDonations.length > 0 && (
          <Box
            sx={{
              mb: 10,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 2,
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Recent Activity
            </Typography>
            <Box
              sx={{
                display: 'flex',
                animation: 'scroll 30s linear infinite',
                '@keyframes scroll': {
                  '0%': {
                    transform: 'translateX(0)',
                  },
                  '100%': {
                    transform: 'translateX(-50%)',
                  },
                },
              }}
            >
              {/* Duplicate items for seamless loop */}
              {[...recentDonations, ...recentDonations].map((donation, index) => (
                <Chip
                  key={index}
                  label={donation.text}
                  sx={{
                    mx: 2,
                    py: 2,
                    px: 1,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                    color: '#2e7d32',
                    minWidth: 'fit-content',
                  }}
                  icon={<TrendingUp sx={{ color: '#43a047' }} />}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Features Section */}
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Why Choose RescueRoute?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 4,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Speed sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Fast & Easy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quick listing creation and instant claim notifications
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 4,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Secure & Trusted
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified donors and NGOs with transparent communication
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 4,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Favorite sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Eco-Friendly
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reduce food waste and make a positive environmental impact
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 4,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Community Impact
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect with local organizations and feed those in need
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            mb: 6,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 6,
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join hundreds of donors and NGOs fighting food waste together
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              py: 2,
              px: 6,
              borderRadius: 4,
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'none',
              background: 'white',
              color: '#667eea',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Get Started Free
          </Button>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 RescueRoute. Made with ❤️ to reduce food waste and feed communities.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
