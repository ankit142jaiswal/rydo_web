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
  Divider,
} from '@mui/material';
import {
  Notifications,
  ExitToApp,
  Person,
  History,
  AccountBalanceWallet,
  Menu as MenuIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import AuthModal from '../auth/AuthModal';

/**
 * Header — public-facing top app bar used outside of the role-specific layouts.
 * Shows the Rydo brand, notification bell, and user avatar/menu when logged in,
 * or a login button when logged out.
 */
const Header = ({ onMenuClick }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#ffffff',
          color: '#1a1a2e',
          borderBottom: '1px solid #f1f5f9',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, gap: 1, minHeight: { xs: 60, sm: 68 } }}>
          {/* Optional hamburger for pages that pass onMenuClick */}
          {onMenuClick && (
            <IconButton
              edge="start"
              onClick={onMenuClick}
              sx={{
                display: { md: 'none' },
                color: '#475569',
                mr: 0.5,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
            <img
              src="/rydo_logo.png"
              alt="Rydo"
              style={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                backgroundColor: '#fff',
                borderRadius: 8,
                padding: 4,
              }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#FFC107',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                Rydo
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#94a3b8', fontWeight: 500, lineHeight: 1 }}
              >
                Ride Management
              </Typography>
            </Box>
            {/* Mobile brand text */}
            <Typography
              variant="h6"
              sx={{
                display: { xs: 'block', sm: 'none' },
                fontWeight: 800,
                color: '#FFC107',
                letterSpacing: '-0.02em',
              }}
            >
              Rydo
            </Typography>
          </Box>

          {/* Right section — authenticated */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* Notification bell */}
              <IconButton
                onClick={handleNotifOpen}
                sx={{
                  color: '#64748b',
                  '&:hover': { bgcolor: '#f8fafc', color: '#FFC107' },
                }}
              >
                <Badge
                  badgeContent={3}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}
                >
                  <Notifications fontSize="small" />
                </Badge>
              </IconButton>

              {/* Notification dropdown */}
              <Menu
                anchorEl={notifAnchorEl}
                open={Boolean(notifAnchorEl)}
                onClose={handleNotifClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 280,
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #f1f5f9',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                    Notifications
                  </Typography>
                </Box>
                {[
                  { text: 'Your ride has been confirmed', time: '2 min ago' },
                  { text: 'Driver is 5 minutes away', time: '8 min ago' },
                  { text: 'Ride completed successfully', time: '1 hr ago' },
                ].map((n, i) => (
                  <MenuItem
                    key={i}
                    onClick={handleNotifClose}
                    sx={{ py: 1.5, px: 2, alignItems: 'flex-start', gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#FFC107',
                        mt: 0.5,
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#1a1a2e', lineHeight: 1.4 }}>
                        {n.text}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {n.time}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem
                  onClick={handleNotifClose}
                  sx={{ justifyContent: 'center', py: 1.25 }}
                >
                  <Typography variant="body2" sx={{ color: '#FFC107', fontWeight: 600 }}>
                    View all notifications
                  </Typography>
                </MenuItem>
              </Menu>

              {/* Avatar button */}
              <Button
                onClick={handleMenuOpen}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2.5,
                  px: 1.5,
                  py: 0.75,
                  ml: 0.5,
                  bgcolor: '#f8fafc',
                  color: '#1a1a2e',
                  gap: 1,
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
                    color: '#1a1a1a',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {userInitial}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
                >
                  {user.name?.split(' ')[0]}
                </Typography>
              </Button>

              {/* User dropdown */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #f1f5f9',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {user.email}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={handleMenuClose}
                  sx={{ gap: 1.5, py: 1.25, mx: 0.5, mt: 0.5, borderRadius: 1.5 }}
                >
                  <Person fontSize="small" sx={{ color: '#94a3b8' }} />
                  <Typography variant="body2">Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  sx={{ gap: 1.5, py: 1.25, mx: 0.5, borderRadius: 1.5 }}
                >
                  <History fontSize="small" sx={{ color: '#94a3b8' }} />
                  <Typography variant="body2">Ride History</Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  sx={{ gap: 1.5, py: 1.25, mx: 0.5, borderRadius: 1.5 }}
                >
                  <AccountBalanceWallet fontSize="small" sx={{ color: '#94a3b8' }} />
                  <Typography variant="body2">Wallet</Typography>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    gap: 1.5,
                    py: 1.25,
                    mx: 0.5,
                    mb: 0.5,
                    borderRadius: 1.5,
                    color: '#ef4444',
                  }}
                >
                  <ExitToApp fontSize="small" />
                  <Typography variant="body2">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            /* Logged-out state */
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => setAuthModalOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
                color: '#1a1a1a',
                fontWeight: 700,
                borderRadius: 2.5,
                px: { xs: 2, sm: 3 },
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)',
                  boxShadow: '0 4px 12px rgba(255,193,7,0.4)',
                },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Sign in
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                Login
              </Box>
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
