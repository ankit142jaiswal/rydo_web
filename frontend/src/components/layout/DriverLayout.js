import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge,
  Switch,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  DirectionsCar,
  AttachMoney,
  History,
  Person,
  Notifications,
  Settings,
  Logout,
  ChevronRight,
  FiberManualRecord,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { text: 'Dashboard',     icon: Dashboard,      path: '/driver' },
  { text: 'Active Rides',  icon: DirectionsCar,  path: '/driver/rides' },
  { text: 'Earnings',      icon: AttachMoney,    path: '/driver/earnings' },
  { text: 'History',       icon: History,        path: '/driver/history' },
  { text: 'Profile',       icon: Person,         path: '/driver/profile' },
  { text: 'Notifications', icon: Notifications,  path: '/driver/notifications' },
  { text: 'Settings',      icon: Settings,       path: '/driver/settings' },
];

function SidebarContent({ location, navigate, onItemClick, isOnline, onToggleOnline }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid #f1f5f9',
          minHeight: 72,
        }}
      >
        <img
          src="/rydo_logo.png"
          alt="Rydo"
          style={{ width: 40, height: 40, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 8, padding: 4 }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>
            Rydo
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
            Driver Portal
          </Typography>
        </Box>
      </Box>

      {/* Online/Offline toggle */}
      <Box
        sx={{
          mx: 1.5,
          mt: 1.5,
          mb: 0.5,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: isOnline ? '#f0fdf4' : '#f8fafc',
          border: `1px solid ${isOnline ? '#bbf7d0' : '#e2e8f0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FiberManualRecord
            sx={{
              fontSize: 10,
              color: isOnline ? '#10b981' : '#94a3b8',
              animation: isOnline ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.4 },
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: isOnline ? '#059669' : '#64748b',
            }}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        </Box>
        <Switch
          checked={isOnline}
          onChange={onToggleOnline}
          size="small"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#10b981' },
          }}
        />
      </Box>

      {/* Nav items */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List disablePadding>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === '/driver'
                ? location.pathname === '/driver' || location.pathname === '/driver/'
                : location.pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 1, mb: 0.25 }}>
                <ListItemButton
                  onClick={() => { navigate(item.path); onItemClick?.(); }}
                  sx={{
                    borderRadius: 2,
                    px: 1.5,
                    py: 1.1,
                    transition: 'all 0.15s ease',
                    ...(isActive
                      ? {
                          background: 'linear-gradient(90deg, #fff8e1, #fff3cd)',
                          '& .MuiListItemIcon-root': { color: '#FF8F00' },
                          '& .MuiListItemText-primary': { color: '#FF8F00', fontWeight: 700 },
                          boxShadow: '0 2px 8px rgba(255,193,7,0.2)',
                          borderLeft: '3px solid #FFC107',
                        }
                      : {
                          '& .MuiListItemIcon-root': { color: '#94a3b8' },
                          '& .MuiListItemText-primary': { color: '#475569', fontWeight: 500 },
                          '&:hover': {
                            backgroundColor: '#f8fafc',
                            '& .MuiListItemIcon-root': { color: '#FFC107' },
                          },
                        }),
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <item.icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                  {isActive && (
                    <ChevronRight sx={{ fontSize: 16, color: '#FFC107', opacity: 0.7 }} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom branding */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderTop: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          mx: 1,
          mb: 1,
          borderRadius: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
          Rydo Driver v2.0
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,193,7,0.7)', fontWeight: 600 }}>
          Earn More, Drive Smart
        </Typography>
      </Box>
    </Box>
  );
}

const DriverLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/api/drivers/dashboard');
        if (response.data.success) {
          setIsOnline(response.data.dashboard.isOnline);
        }
      } catch (error) {
        // silent
      }
    };
    fetchStatus();

    const fetchUnread = async () => {
      try {
        const response = await axios.get('/api/notifications?isRead=false');
        if (response.data.success) {
          setUnreadCount(response.data.unreadCount || 0);
        }
      } catch (error) {
        // silent
      }
    };
    fetchUnread();
    const unreadInterval = setInterval(fetchUnread, 60000);
    return () => clearInterval(unreadInterval);
  }, []);

  const handleOnlineToggle = async () => {
    try {
      const response = await axios.post('/api/drivers/toggle-status', {
        isOnline: !isOnline,
      });
      if (response.data.success) {
        setIsOnline(response.data.isOnline);
      }
    } catch (error) {
      // optimistic toggle fallback
      setIsOnline((prev) => !prev);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/driver/profile');
  };

  const currentPage = NAV_ITEMS.find((item) =>
    item.path === '/driver'
      ? location.pathname === '/driver' || location.pathname === '/driver/'
      : location.pathname.startsWith(item.path)
  );

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'D';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f6fa' }}>
      {/* Permanent desktop sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '2px 0 12px rgba(0,0,0,0.06)',
            bgcolor: '#ffffff',
          },
        }}
      >
        <SidebarContent
          location={location}
          navigate={navigate}
          isOnline={isOnline}
          onToggleOnline={handleOnlineToggle}
        />
      </Drawer>

      {/* Temporary mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        <SidebarContent
          location={location}
          navigate={navigate}
          onItemClick={() => setMobileOpen(false)}
          isOnline={isOnline}
          onToggleOnline={handleOnlineToggle}
        />
      </Drawer>

      {/* Main area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
        >
          <Toolbar sx={{ gap: 1, minHeight: { xs: 60, sm: 68 } }}>
            {/* Mobile hamburger */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, color: 'rgba(255,255,255,0.8)' }}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile brand */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                gap: 1,
                flex: 1,
              }}
            >
              <img
                src="/rydo_logo.png"
                alt="Rydo"
                style={{ width: 40, height: 40, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 8, padding: 4 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFC107' }}>
                Rydo
              </Typography>
            </Box>

            {/* Breadcrumb — desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                Driver
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>/</Typography>
              <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                {currentPage?.text ?? 'Dashboard'}
              </Typography>
            </Box>

            {/* Status chip — desktop only */}
            <Chip
              icon={
                <FiberManualRecord
                  sx={{ fontSize: '10px !important', color: isOnline ? '#10b981' : '#94a3b8' }}
                />
              }
              label={isOnline ? 'Online' : 'Offline'}
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                bgcolor: isOnline ? 'rgba(16,185,129,0.15)' : 'rgba(148,163,184,0.15)',
                color: isOnline ? '#6ee7b7' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: `1px solid ${isOnline ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.2)'}`,
                height: 28,
                '& .MuiChip-icon': { ml: 0.5 },
              }}
            />

            {/* Right actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton
                  onClick={() => navigate('/driver/notifications')}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#FFC107' },
                  }}
                >
                  <Badge badgeContent={unreadCount || null} color="error">
                    <Notifications fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title={user?.name ?? 'Driver'}>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
                      color: '#1a1a1a',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      border: '2px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {userInitial}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Avatar dropdown */}
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
              {user?.name ?? 'Driver'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              {user?.email ?? ''}
            </Typography>
          </Box>
          <MenuItem
            onClick={handleProfile}
            sx={{ gap: 1.5, py: 1.25, mx: 0.5, mt: 0.5, borderRadius: 1.5 }}
          >
            <Person fontSize="small" sx={{ color: '#94a3b8' }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ gap: 1.5, py: 1.25, mx: 0.5, mb: 0.5, borderRadius: 1.5, color: '#ef4444' }}
          >
            <Logout fontSize="small" />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DriverLayout;
