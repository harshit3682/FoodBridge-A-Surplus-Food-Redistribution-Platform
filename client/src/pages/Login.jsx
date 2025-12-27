import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Email,
  Lock,
  Restaurant,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Wait a bit for user state to update
      setTimeout(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          navigate(user.role === 'DONOR' ? '/donor' : '/ngo');
        } else {
          navigate('/donor');
        }
      }, 100);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        },
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 5 },
              width: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Logo Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                }}
              >
                <Restaurant sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                component="h1"
                variant="h3"
                align="center"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                RescueRoute
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Welcome back! Sign in to continue
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in={!!error}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      alignItems: 'center',
                    },
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Register Link */}
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary" component="span">
                  Don't have an account?{' '}
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{
                    fontWeight: 600,
                    color: '#667eea',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Register here
                </Link>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;

