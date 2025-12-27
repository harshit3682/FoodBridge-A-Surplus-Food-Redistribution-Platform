import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Chip,
} from '@mui/material';
import { Dashboard, Analytics, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    return user?.role === 'DONOR' ? '/donor' : '/ngo';
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fb 0%, #e8f5e9 50%, #fff3e0 100%)',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #2e7d32 0%, #43a047 50%, #66bb6a 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}
          >
            🍽️ RescueRoute
          </Typography>
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate(getDashboardPath())}
            sx={{
              mr: 1,
              fontWeight: location.pathname.startsWith('/donor') || location.pathname.startsWith('/ngo') ? 700 : 400,
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            startIcon={<Analytics />}
            onClick={() => navigate('/analytics')}
            sx={{
              mr: 2,
              fontWeight: location.pathname.startsWith('/analytics') ? 700 : 400,
            }}
          >
            Analytics
          </Button>

          <Tooltip title={`${user?.name} (${user?.role})`}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: 'primary.main',
                  width: 36,
                  height: 36,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {getInitials(user?.name || user?.email || 'U')}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: '45px' }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
              <Typography variant="subtitle2">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
              <Chip
                label={user?.role}
                size="small"
                color="success"
                sx={{ mt: 0.5, fontSize: 10 }}
              />
            </Box>
            <Divider />
            {/* Placeholder for future profile/settings options */}
            {/* <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
              Profile
            </MenuItem> */}
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          flex: 1,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;



