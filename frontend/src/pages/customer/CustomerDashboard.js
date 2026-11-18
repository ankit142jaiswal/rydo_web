import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  DirectionsCar,
  AttachMoney,
  Star,
  LocationOn,
  Person,
  Add,
  History,
  AccountBalanceWallet
} from '@mui/icons-material';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRides: 0,
    totalSpent: 0,
    savedAmount: 0,
    averageRating: 0
  });
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/customers/dashboard');
      if (response.data.success) {
        const dashboard = response.data.dashboard;
        setStats({
          totalRides: dashboard.total?.rides || 0,
          totalSpent: dashboard.month?.spending || 0,
          savedAmount: dashboard.wallet || 0,
          averageRating: dashboard.total?.rating || 5.0
        });
      }
      
      // Fetch recent rides
      const ridesResponse = await axios.get('/api/customers/rides?limit=5');
      if (ridesResponse.data.success) {
        setRecentRides(ridesResponse.data.rides.map(ride => ({
          id: ride._id,
          driver: ride.driver?.name || 'Finding driver...',
          fare: ride.fare?.total || 0,
          from: ride.pickup?.address || 'N/A',
          to: ride.destination?.address || 'N/A',
          date: new Date(ride.createdAt).toLocaleDateString(),
          rating: ride.rating?.customerRating || 5
        })));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [quickActions] = useState([
    { title: 'Book a Ride', icon: DirectionsCar, path: '/customer/book', color: '#1976d2' },
    { title: 'Ride History', icon: History, path: '/customer/rides', color: '#388e3c' },
    { title: 'My Wallet', icon: AccountBalanceWallet, path: '/customer/wallet', color: '#f57c00' }
  ]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome Back!
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.totalRides}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Rides
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
                <Avatar sx={{ bgcolor: '#388e3c' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{stats.totalSpent}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
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
                <Avatar sx={{ bgcolor: '#f57c00' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.averageRating}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
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
                <Avatar sx={{ bgcolor: '#9c27b0' }}>
                  <AccountBalanceWallet />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹{stats.savedAmount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Money Saved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outlined"
                    startIcon={<action.icon />}
                    fullWidth
                    onClick={async () => {
                      try {
                        await axios.post('/api/customers/activity-log', {
                          action: 'quick-action',
                          actionType: action.title,
                          path: action.path,
                          section: 'customer-dashboard'
                        });
                      } catch (error) {
                        console.error('Error logging quick action:', error);
                      }
                      navigate(action.path);
                    }}
                    sx={{ 
                      justifyContent: 'flex-start',
                      borderColor: action.color,
                      color: action.color,
                      '&:hover': {
                        backgroundColor: `${action.color}10`,
                        borderColor: action.color
                      }
                    }}
                  >
                    {action.title}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Rides */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Rides
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<Add />}
                  onClick={async () => {
                    try {
                      await axios.post('/api/customers/activity-log', {
                        action: 'book-new-ride',
                        section: 'customer-dashboard'
                      });
                    } catch (error) {
                      console.error('Error logging book new ride:', error);
                    }
                    navigate('/customer/book');
                  }}
                >
                  Book New Ride
                </Button>
              </Box>
              
              <List>
                {recentRides.map((ride, index) => (
                  <React.Fragment key={ride.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{ride.driver}</Typography>
                            <Chip 
                              label={`₹${ride.fare}`} 
                              color="success" 
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <LocationOn fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {ride.from} → {ride.to}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                {ride.date}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {[...Array(ride.rating)].map((_, i) => (
                                  <Star key={i} sx={{ fontSize: 16, color: '#FFD700' }} />
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentRides.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Loyalty Progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loyalty Program
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress to Gold Status</Typography>
                  <Typography variant="body2">75%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Complete 10 more rides to unlock Gold benefits
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Typography variant="h6" color="primary">5%</Typography>
                    <Typography variant="body2">Cashback</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Typography variant="h6" color="primary">Priority</Typography>
                    <Typography variant="body2">Booking</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Typography variant="h6" color="primary">24/7</Typography>
                    <Typography variant="body2">Support</Typography>
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

export default CustomerDashboard;