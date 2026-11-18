import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Badge, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Notifications, Person, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications?isRead=false');
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    // Navigate to profile based on user role
    if (user?.role === 'admin') {
      navigate('/admin/profile');
    } else if (user?.role === 'customer') {
      navigate('/customer/profile');
    } else if (user?.role === 'driver') {
      navigate('/driver/profile');
    }
  };

  const handleNotifications = () => {
    // Navigate to notifications based on user role
    if (user?.role === 'admin') {
      navigate('/admin/notifications');
    } else if (user?.role === 'customer') {
      navigate('/customer/notifications');
    } else if (user?.role === 'driver') {
      navigate('/driver/notifications');
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1201,
        backgroundColor: '#ffffff',
        color: '#1e293b',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        <IconButton 
          color="inherit" 
          onClick={onMenuClick} 
          sx={{ 
            mr: 2,
            '&:hover': { backgroundColor: '#f1f5f9' }
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            R
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            RYDO
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', ml: 1 }}>
            Dashboard
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            color="inherit"
            onClick={handleNotifications}
            sx={{ '&:hover': { backgroundColor: '#f1f5f9' } }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Typography>
            </Box>
            <IconButton 
              onClick={handleMenu}
              sx={{ 
                '&:hover': { backgroundColor: '#f1f5f9' },
                border: '1px solid #e2e8f0'
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfile}>
                <Person sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;