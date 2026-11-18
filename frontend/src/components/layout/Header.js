import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Chip
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  ExitToApp,
  Person,
  History,
  Wallet
} from '@mui/icons-material';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          color: 'black', 
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              sx={{ 
                color: '#FFA726',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '-0.5px'
              }}
            >
              RYDO
            </Typography>
            <Chip 
              label="BETA" 
              size="small" 
              sx={{ 
                ml: 1, 
                bgcolor: '#FFF3E0', 
                color: '#FFA726',
                fontSize: '0.7rem',
                height: 20
              }} 
            />
          </Box>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small"
                sx={{ 
                  bgcolor: '#f5f5f5',
                  '&:hover': { bgcolor: '#e0e0e0' }
                }}
              >
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
                  <Notifications sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
              
              <Button
                onClick={handleMenuOpen}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  bgcolor: '#f8f9fa',
                  color: '#333',
                  '&:hover': { bgcolor: '#e9ecef' }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 28, 
                    height: 28, 
                    mr: 1,
                    bgcolor: '#FFA726',
                    fontSize: '0.9rem'
                  }}
                >
                  {user.name[0]}
                </Avatar>
                <Typography variant="body2" fontWeight="600">
                  {user.name.split(' ')[0]}
                </Typography>
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 200,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                  <Person sx={{ mr: 2, color: '#666' }} />
                  <Typography variant="body2">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                  <History sx={{ mr: 2, color: '#666' }} />
                  <Typography variant="body2">Ride History</Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                  <Wallet sx={{ mr: 2, color: '#666' }} />
                  <Typography variant="body2">Wallet</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5, borderTop: '1px solid #f0f0f0' }}>
                  <ExitToApp sx={{ mr: 2, color: '#f44336' }} />
                  <Typography variant="body2" color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => setAuthModalOpen(true)}
              sx={{
                bgcolor: '#FFA726',
                color: 'white',
                borderRadius: 3,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#FF9800',
                  boxShadow: 'none'
                }
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;