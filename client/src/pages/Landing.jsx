import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Restaurant,
  People,
  Analytics,
  Login as LoginIcon,
  PersonAdd,
  AccessTime,
  LocationOn,
  Verified,
  TrendingUp,
} from "@mui/icons-material";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)",
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              mx: "auto",
              boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
            }}
          >
            <Restaurant sx={{ fontSize: 50, color: "white" }} />
          </Box>
          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            RescueRoute
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 1, fontWeight: 400, color: "text.secondary" }}
          >
            Surplus Food Redistribution Platform
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 600, mx: "auto", color: "text.secondary" }}
          >
            Connecting restaurants, bakeries, and wedding halls with NGOs and shelters
            to redistribute surplus food before it expires. Together, we can reduce food
            waste and fight hunger in our communities.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/login")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PersonAdd />}
              onClick={() => navigate("/register")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.light",
                  bgcolor: "rgba(76, 175, 80, 0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 6, bgcolor: "rgba(255, 255, 255, 0.1)" }} />

        {/* About Section */}
        <Box mb={8}>
          <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            About RescueRoute
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUp sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Our Mission
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    RescueRoute is a platform designed to bridge the gap between food
                    waste and hunger. We connect food donors (restaurants, bakeries,
                    wedding halls) with NGOs and shelters to ensure surplus food reaches
                    those in need instead of ending up in landfills.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our goal is to create a sustainable ecosystem where food waste is
                    minimized, and communities benefit from surplus food donations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUp sx={{ fontSize: 40, color: "secondary.main", mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Impact
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    By using RescueRoute, you're contributing to:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, color: "text.secondary" }}>
                    <li>Reducing food waste and environmental impact</li>
                    <li>Supporting local communities and fighting hunger</li>
                    <li>Creating a sustainable food redistribution network</li>
                    <li>Building connections between donors and NGOs</li>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6, bgcolor: "rgba(255, 255, 255, 0.1)" }} />

        {/* Features Section */}
        <Box mb={8}>
          <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease, boxShadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "primary.main",
                    }}
                  >
                    <Restaurant sx={{ fontSize: 40, color: "white" }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    For Food Donors
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Restaurants, bakeries, and wedding halls can easily list surplus
                    food items with details like quantity, expiration time, and pickup
                    location.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      ✓ Easy listing creation
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      ✓ Real-time claim notifications
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      ✓ Verification system
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease, boxShadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "secondary.main",
                    }}
                  >
                    <People sx={{ fontSize: 40, color: "white" }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    For NGOs & Shelters
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    NGOs can browse available food listings on an interactive map, claim
                    food items, and manage their claims efficiently.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 600 }}>
                      ✓ Interactive map view
                    </Typography>
                    <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 600 }}>
                      ✓ Easy claim management
                    </Typography>
                    <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 600 }}>
                      ✓ Real-time updates
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease, boxShadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "primary.light",
                    }}
                  >
                    <Analytics sx={{ fontSize: 40, color: "white" }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Analytics & Tracking
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Track your impact with detailed analytics showing listings, claims,
                    and distribution statistics.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="primary.light" sx={{ fontWeight: 600 }}>
                      ✓ Impact metrics
                    </Typography>
                    <Typography variant="body2" color="primary.light" sx={{ fontWeight: 600 }}>
                      ✓ Performance tracking
                    </Typography>
                    <Typography variant="body2" color="primary.light" sx={{ fontWeight: 600 }}>
                      ✓ Visual analytics
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6, bgcolor: "rgba(255, 255, 255, 0.1)" }} />

        {/* Key Features */}
        <Box mb={8}>
          <Typography variant="h4" textAlign="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Key Features
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <AccessTime sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Time-Sensitive
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Automatic expiration handling ensures food is claimed before it expires
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <LocationOn sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Location-Based
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interactive map helps NGOs find food donations in their area
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Verified sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Verification System
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  QR code verification ensures secure and verified food pickups
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Analytics sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Real-Time Updates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Live notifications and updates keep everyone informed
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid rgba(76, 175, 80, 0.2)",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            Join RescueRoute today and be part of the solution to reduce food waste and
            fight hunger in your community.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAdd />}
            onClick={() => navigate("/register")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 600,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
