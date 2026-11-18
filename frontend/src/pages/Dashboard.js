import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  DirectionsCar,
  People,
  AttachMoney,
  TrendingUp,
  DriveEta,
  PersonAdd
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}20`,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px -8px rgba(0,0,0,0.1)'
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box sx={{ flex: 1 }}>
          <Typography color="textSecondary" variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 0.5, color: '#1e293b' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box 
          sx={{ 
            p: 1.5,
            borderRadius: 2,
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, customers: 0, drivers: 0, onlineDrivers: 0 },
    rides: { total: 0, completed: 0, today: 0, month: 0, completionRate: 0 },
    revenue: { total: 0, today: 0, month: 0 },
    recentRides: []
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchChartData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/analytics/rides?period=7d');
      setChartData(response.data.analytics);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: '#f59e0b',
      accepted: '#3b82f6',
      started: '#8b5cf6',
      completed: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Welcome back! Here's what's happening with RYDO today.
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rides"
            value={dashboardData.rides.total.toLocaleString()}
            subtitle={`${dashboardData.rides.today} today`}
            trend="+12% from last month"
            icon={<DirectionsCar sx={{ fontSize: 24 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Drivers"
            value={dashboardData.users.onlineDrivers}
            subtitle={`${dashboardData.users.drivers} total drivers`}
            trend="+5 new this week"
            icon={<DriveEta sx={{ fontSize: 24 }} />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Revenue"
            value={`₹${dashboardData.revenue.today.toLocaleString()}`}
            subtitle={`₹${dashboardData.revenue.month.toLocaleString()} this month`}
            trend="+18% from yesterday"
            icon={<AttachMoney sx={{ fontSize: 24 }} />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completion Rate"
            value={`${dashboardData.rides.completionRate}%`}
            subtitle="Ride success rate"
            trend="+2.5% improvement"
            icon={<TrendingUp sx={{ fontSize: 24 }} />}
            color="#8b5cf6"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              Rides Trend (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="_id" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalRides" 
                  stroke="#1976d2" 
                  fillOpacity={1} 
                  fill="url(#colorRides)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="completedRides" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCompleted)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              Quick Stats
            </Typography>
            <Box sx={{ space: 3 }}>
              <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: '#f8fafc' }}>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                  Total Users
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {dashboardData.users.total.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PersonAdd sx={{ fontSize: 16, color: '#10b981', mr: 0.5 }} />
                  <Typography variant="caption" sx={{ color: '#10b981' }}>
                    +{dashboardData.users.customers} customers
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: '#f0f9ff' }}>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                  Monthly Revenue
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  ₹{dashboardData.revenue.month.toLocaleString()}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: '#e0f2fe',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1976d2'
                      }
                    }} 
                  />
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                    75% of monthly target
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f0fdf4' }}>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                  Monthly Rides
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {dashboardData.rides.month.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#10b981' }}>
                  {dashboardData.rides.completed} completed
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Recent Rides
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Ride ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Driver</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Service</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Fare</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData.recentRides.slice(0, 8).map((ride) => (
                <TableRow key={ride._id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell sx={{ fontWeight: 500, color: '#1976d2' }}>{ride.rideId}</TableCell>
                  <TableCell>{ride.customer?.name || 'N/A'}</TableCell>
                  <TableCell>{ride.driver?.name || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ride.serviceType} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#f1f5f9',
                        color: '#1e293b',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ride.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(ride.status)}15`,
                        color: getStatusColor(ride.status),
                        fontWeight: 500,
                        border: `1px solid ${getStatusColor(ride.status)}30`
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>₹{ride.fare.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;