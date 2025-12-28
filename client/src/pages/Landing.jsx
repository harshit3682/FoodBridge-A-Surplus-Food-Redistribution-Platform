import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Restaurant,
  People,
  Analytics,
  Login as LoginIcon,
  PersonAdd,
} from "@mui/icons-material";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        },
        "@keyframes gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={6}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              mx: "auto",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
            }}
          >
            <Restaurant sx={{ fontSize: 60, color: "white" }} />
          </Box>
          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            RescueRoute
          </Typography>
          <Typography
            variant="h5"
            color="white"
            sx={{ mb: 4, fontWeight: 300 }}
          >
            Connecting Food Donors with NGOs to Reduce Food Waste and Fight
            Hunger
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
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "rgba(255, 255, 255, 0.9)",
                color: "#667eea",
                boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(255, 255, 255, 0.4)",
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
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderColor: "rgba(255, 255, 255, 0.8)",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
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
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <Restaurant sx={{ fontSize: 40, color: "white" }} />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  For Food Donors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Easily list surplus food items and connect with local NGOs who
                  can distribute them to those in need.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
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
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #4facfe 100%)",
                  }}
                >
                  <People sx={{ fontSize: 40, color: "white" }} />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  For NGOs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access available food donations in your area and efficiently
                  manage food distribution to communities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
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
                    background:
                      "linear-gradient(135deg, #00f2fe 0%, #f093fb 100%)",
                  }}
                >
                  <Analytics sx={{ fontSize: 40, color: "white" }} />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Impact Tracking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your contributions and see the real impact you're
                  making in reducing food waste and hunger.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;
