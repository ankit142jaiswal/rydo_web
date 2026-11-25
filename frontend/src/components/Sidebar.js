import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import { Dashboard, DirectionsCar, People, Person, Analytics, Settings, TrendingUp } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Rides', icon: <DirectionsCar />, path: '/admin/rides' },
  { text: 'Drivers', icon: <People />, path: '/admin/drivers' },
  { text: 'Customers', icon: <Person />, path: '/admin/customers' },
  { text: 'Analytics', icon: <TrendingUp />, path: '/admin/analytics' },
  { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
];

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 280 : 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : 80,
          boxSizing: 'border-box',
          mt: 8,
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: 'none',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin');
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: isActive ? '#f0f9ff' : 'transparent',
                  border: isActive ? '1px solid #bae6fd' : '1px solid transparent',
                  color: isActive ? '#0369a1' : '#64748b',
                  '&:hover': { 
                    backgroundColor: isActive ? '#f0f9ff' : '#f8fafc',
                    color: '#1e293b'
                  },
                  transition: 'all 0.2s ease-in-out',
                  minHeight: 48,
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: open ? 40 : 'auto', 
                    justifyContent: 'center',
                    color: 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary={item.text} 
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                      }
                    }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
        
        {open && (
          <>
            <Divider sx={{ mx: 2, my: 2 }} />
            <Box sx={{ px: 3, py: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                <Box sx={{ fontSize: '0.75rem', opacity: 0.9, mb: 0.5 }}>Version</Box>
                <Box sx={{ fontSize: '0.875rem', fontWeight: 600 }}>v2.0.0</Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;

