import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  AttachMoney,
  DirectionsCar,
  Star,
  TrendingUp,
  Person,
  LocationOn
} from '@mui/icons-material';
import axios from 'axios';

const DriverDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/drivers/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.dashboard);
        setIsOnline(response.data.dashboard.isOnline);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      // Log status toggle activity
      await axios.post('/api/drivers/activity-log', {
        action: 'toggle-online-status',
        newStatus: !isOnline,
        section: 'driver-dashboard'
      });
      
      const response = await axios.post('/api/drivers/toggle-status', {
        isOnline: !isOnline
      });
      if (response.data.success) {
        setIsOnline(response.data.isOnline);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const updateRideStatus = async (rideId, status) => {
    try {
      // Log ride status update activity
      await axios.post('/api/drivers/activity-log', {
        action: 'update-ride-status',
        rideId: rideId,
        newStatus: status,
        section: 'driver-dashboard'
      });
      
      await axios.put(`/api/rides/${rideId}/status`, { status });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating ride status:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Unable to load dashboard data</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Driver Dashboard
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isOnline}
              onChange={toggleOnlineStatus}
              color="success"
            />
          }
          label={isOnline ? 'Online' : 'Offline'}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4CAF50' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{dashboardData.today.earnings.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Earnings
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#2196F3' }}>
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h6">{dashboardData.today.rides}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Rides
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#FF9800' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6">{dashboardData.rating.toFixed(1)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#9C27B0' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{dashboardData.month.earnings.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Earnings
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Rides */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Rides
              </Typography>
              {dashboardData.pendingRides && dashboardData.pendingRides.length > 0 ? (
                dashboardData.pendingRides.map((ride) => (
                  <Box key={ride._id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1">{ride.customer?.name || 'Customer'}</Typography>
                      <Chip 
                        label={ride.status} 
                        color={ride.status === 'accepted' ? 'primary' : 'warning'} 
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">
                        {ride.pickup.address} → {ride.destination.address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {ride.distance} km • ₹{ride.fare.total}
                      </Typography>
                      {ride.status === 'accepted' && (
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="success"
                          onClick={async () => {
                            try {
                              await axios.post('/api/drivers/activity-log', {
                                action: 'start-ride-button',
                                rideId: ride.rideId,
                                section: 'driver-dashboard'
                              });
                            } catch (error) {
                              console.error('Error logging start ride:', error);
                            }
                            updateRideStatus(ride.rideId, 'started');
                          }}
                        >
                          Start Ride
                        </Button>
                      )}
                      {ride.status === 'started' && (
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="success"
                          onClick={async () => {
                            try {
                              await axios.post('/api/drivers/activity-log', {
                                action: 'complete-ride-button',
                                rideId: ride.rideId,
                                section: 'driver-dashboard'
                              });
                            } catch (error) {
                              console.error('Error logging complete ride:', error);
                            }
                            updateRideStatus(ride.rideId, 'completed');
                          }}
                        >
                          Complete Ride
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  {isOnline ? 'No active rides. Waiting for ride requests...' : 'Go online to receive ride requests.'}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Total Rides Completed
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {dashboardData.total.rides}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Total Earnings
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      ₹{dashboardData.total.earnings.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Customer Rating
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dashboardData.rating / 5) * 100} 
                      sx={{ height: 8, borderRadius: 4 }}
                      color="warning"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {dashboardData.rating.toFixed(1)}/5.0
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverDashboard;