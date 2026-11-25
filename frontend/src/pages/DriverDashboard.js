import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Avatar,
  Chip,
  Paper
} from '@mui/material';
import {
  AttachMoney,
  DirectionsCar,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    today: { rides: 0, earnings: 0 },
    month: { rides: 0, earnings: 0 },
    total: { rides: 0, earnings: 0 },
    rating: 5.0,
    isOnline: false,
    pendingRides: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/drivers/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const response = await axios.post('/api/drivers/toggle-status', {
        isOnline: !dashboardData.isOnline
      });
      if (response.data.success) {
        setDashboardData(prev => ({
          ...prev,
          isOnline: response.data.isOnline
        }));
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Driver Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Welcome back, {user?.name}!
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={dashboardData.isOnline}
              onChange={toggleOnlineStatus}
              color="success"
            />
          }
          label={dashboardData.isOnline ? 'Online' : 'Offline'}
          sx={{ 
            '& .MuiFormControlLabel-label': { 
              fontWeight: 600,
              color: dashboardData.isOnline ? '#4caf50' : '#f44336'
            }
          }}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1a1a2e' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{dashboardData.today.earnings}</Typography>
                  <Typography variant="body2" color="textSecondary">Today's Earnings</Typography>
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
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h6">{dashboardData.today.rides}</Typography>
                  <Typography variant="body2" color="textSecondary">Today's Rides</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#ff9800' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6">{dashboardData.rating}</Typography>
                  <Typography variant="body2" color="textSecondary">Rating</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#9c27b0' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{dashboardData.total.earnings}</Typography>
                  <Typography variant="body2" color="textSecondary">Total Earnings</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Rides */}
      {dashboardData.pendingRides.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Pending Rides</Typography>
          {dashboardData.pendingRides.map((ride) => (
            <Box key={ride._id} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              mb: 1
            }}>
              <Box>
                <Typography variant="body1">Ride ID: {ride.rideId}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Customer: {ride.customer?.name}
                </Typography>
                <Chip label={ride.status} color="warning" size="small" />
              </Box>
              <Button variant="contained" href={`/rides/${ride.rideId}`}>
                View Details
              </Button>
            </Box>
          ))}
        </Paper>
      )}

      {/* Monthly Summary */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>This Month Summary</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {dashboardData.month.rides}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Rides
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                ₹{dashboardData.month.earnings}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Earnings
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                ₹{Math.round(dashboardData.month.earnings / Math.max(dashboardData.month.rides, 1))}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Avg per Ride
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth variant="outlined" href="/rides">
              View All Rides
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth variant="outlined" href="/earnings">
              Earnings Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth variant="outlined" href="/profile">
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DriverDashboard;
