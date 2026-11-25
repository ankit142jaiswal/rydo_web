import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import {
  DirectionsCar,
  LocalShipping,
  AccountBalanceWallet,
  History
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    wallet: 0,
    totalRides: 0,
    activeRide: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/customers/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const services = [
    { name: 'Bike Taxi', icon: <DirectionsCar />, color: '#1a1a2e', path: '/book?service=bike-taxi' },
    { name: 'Courier', icon: <LocalShipping />, color: '#4caf50', path: '/book?service=courier' },
    { name: 'Auto', icon: <DirectionsCar />, color: '#ff9800', path: '/book?service=auto', disabled: true },
    { name: 'Mini Truck', icon: <LocalShipping />, color: '#9c27b0', path: '/book?service=mini-truck', disabled: true }
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Book your ride or manage your account
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1a1a2e' }}>
                  <AccountBalanceWallet />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{dashboardData.wallet}</Typography>
                  <Typography variant="body2" color="textSecondary">Wallet Balance</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4caf50' }}>
                  <History />
                </Avatar>
                <Box>
                  <Typography variant="h6">{dashboardData.totalRides}</Typography>
                  <Typography variant="body2" color="textSecondary">Total Rides</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Ride */}
      {dashboardData.activeRide && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#e3f2fd' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Active Ride</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1">Ride ID: {dashboardData.activeRide.rideId}</Typography>
              <Chip label={dashboardData.activeRide.status} color="primary" size="small" />
            </Box>
            <Button variant="contained" href="/rides">View Details</Button>
          </Box>
        </Paper>
      )}

      {/* Services */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Choose Your Service</Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={3} key={service.name}>
            <Card 
              sx={{ 
                cursor: service.disabled ? 'not-allowed' : 'pointer',
                opacity: service.disabled ? 0.6 : 1,
                '&:hover': !service.disabled ? { transform: 'translateY(-2px)' } : {}
              }}
              onClick={() => !service.disabled && (window.location.href = service.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: service.color, 
                    width: 60, 
                    height: 60, 
                    mx: 'auto', 
                    mb: 2 
                  }}
                >
                  {service.icon}
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {service.name}
                </Typography>
                {service.disabled && (
                  <Chip label="Coming Soon" size="small" color="warning" />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              href="/rides"
              startIcon={<History />}
            >
              Ride History
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              href="/wallet"
              startIcon={<AccountBalanceWallet />}
            >
              Manage Wallet
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;
