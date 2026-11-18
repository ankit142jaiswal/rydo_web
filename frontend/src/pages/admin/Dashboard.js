import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  DirectionsCar,
  People,
  AttachMoney,
  TwoWheeler,
  LocalShipping,
  Person,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchAnalyticsData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('/api/admin/analytics?period=7d');
      if (response.data.success) {
        setAnalyticsData(response.data.analytics.dailyRides);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (path) => {
    try {
      // Log quick action activity
      await axios.post('/api/admin/activity-log', {
        action: 'quick-action',
        path: path,
        section: 'admin-dashboard'
      });
    } catch (error) {
      console.error('Error logging quick action:', error);
    }
    navigate(path);
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
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
          RYDO Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back! Here's what's happening with RYDO today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${dashboardData.revenue.total.toLocaleString()}`}
            icon={AttachMoney}
            color="success.main"
            subtitle={`₹${dashboardData.revenue.today.toLocaleString()} today`}
            onClick={() => handleQuickAction('/admin/analytics')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Rides"
            value={dashboardData.rides.total.toLocaleString()}
            icon={DirectionsCar}
            color="primary.main"
            subtitle={`${dashboardData.rides.completed} completed`}
            onClick={() => handleQuickAction('/admin/rides')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Online Drivers"
            value={dashboardData.users.onlineDrivers.toLocaleString()}
            icon={People}
            color="info.main"
            subtitle={`${dashboardData.users.drivers} total drivers`}
            onClick={() => handleQuickAction('/admin/drivers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Rides"
            value={dashboardData.rides.today.toLocaleString()}
            icon={TrendingUp}
            color="warning.main"
            subtitle={`${dashboardData.rides.completionRate}% completion rate`}
            onClick={() => handleQuickAction('/admin/rides')}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Revenue & Rides Trend (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="_id" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1976d2" 
                  strokeWidth={3}
                  name="Revenue (₹)"
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#ffc107" 
                  strokeWidth={3}
                  name="Rides"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Service Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Service Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Service distribution data will be available soon
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Rides
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => handleQuickAction('/admin/rides')}
              >
                View All
              </Button>
            </Box>
            <List>
              {dashboardData.recentRides.slice(0, 5).map((ride) => (
                <ListItem key={ride._id} sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: ride.status === 'completed' ? '#10b981' : '#f59e0b' }}>
                      {ride.serviceType === 'bike-taxi' ? <TwoWheeler /> : 
                       ride.serviceType === 'auto' ? <DirectionsCar /> : <LocalShipping />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {ride.customer?.name || 'N/A'} → {ride.driver?.name || 'Unassigned'}
                        </Typography>
                        <Chip
                          label={ride.status}
                          size="small"
                          color={ride.status === 'completed' ? 'success' : 'warning'}
                        />
                      </Box>
                    }
                    secondary={`${ride.serviceType} • ₹${ride.fare.total}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                  onClick={() => handleQuickAction('/admin/drivers')}
                >
                  <People fontSize="large" color="primary" />
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                    Manage Drivers
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                  onClick={() => handleQuickAction('/admin/rides')}
                >
                  <DirectionsCar fontSize="large" color="primary" />
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                    View Rides
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                  onClick={() => handleQuickAction('/admin/analytics')}
                >
                  <AnalyticsIcon fontSize="large" color="primary" />
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                    Analytics
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                  onClick={() => handleQuickAction('/admin/customers')}
                >
                  <Person fontSize="large" color="primary" />
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                    Customers
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;