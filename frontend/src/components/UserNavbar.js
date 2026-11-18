import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { ExitToApp, AccountCircle, Home, DirectionsCar, AccountBalanceWallet, History } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const UserNavbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigate = () => {
    if (user?.role === 'customer') {
      navigate('/customer/profile');
    } else if (user?.role === 'driver') {
      navigate('/driver/profile');
    } else {
      navigate('/profile');
    }
    handleClose();
  };

  const getNavItems = () => {
    if (user?.role === 'customer') {
      return [
        { path: '/customer', label: 'Dashboard', icon: <Home /> },
        { path: '/customer/book', label: 'Book Ride', icon: <DirectionsCar /> },
        { path: '/customer/rides', label: 'My Rides', icon: <History /> },
        { path: '/customer/wallet', label: 'Wallet', icon: <AccountBalanceWallet /> },
      ];
    }
    if (user?.role === 'driver') {
      return [
        { path: '/driver', label: 'Dashboard', icon: <Home /> },
        { path: '/driver/rides', label: 'My Rides', icon: <DirectionsCar /> },
        { path: '/driver/earnings', label: 'Earnings', icon: <AccountBalanceWallet /> },
      ];
    }
    return [];
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title || 'RYDO'}
          </Typography>
          
          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            {getNavItems().map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Profile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
              sx={{ mr: 1 }}
            >
              <AccountCircle />
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.name}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<ExitToApp />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleProfileNavigate}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserNavbar;