import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  DirectionsCar,
  Star,
  Download,
  CalendarToday
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Earnings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const earningsData = {
    today: { amount: 1250, rides: 8, hours: 6.5, tips: 150 },
    week: { amount: 8500, rides: 45, hours: 38, tips: 850 },
    month: { amount: 32000, rides: 180, hours: 160, tips: 3200 }
  };

  const chartData = [
    { name: 'Mon', earnings: 1200, rides: 8 },
    { name: 'Tue', earnings: 1500, rides: 10 },
    { name: 'Wed', earnings: 900, rides: 6 },
    { name: 'Thu', earnings: 1800, rides: 12 },
    { name: 'Fri', earnings: 2100, rides: 14 },
    { name: 'Sat', earnings: 2200, rides: 15 },
    { name: 'Sun', earnings: 1900, rides: 13 }
  ];

  const recentEarnings = [
    {
      id: 'E001',
      date: '2024-01-15',
      time: '14:30',
      customer: 'John Doe',
      route: 'Airport → Downtown',
      distance: '15 km',
      baseFare: 350,
      tip: 50,
      total: 400,
      status: 'completed'
    },
    {
      id: 'E002',
      date: '2024-01-15',
      time: '12:15',
      customer: 'Sarah Wilson',
      route: 'Mall → Residential',
      distance: '8 km',
      baseFare: 180,
      tip: 20,
      total: 200,
      status: 'completed'
    },
    {
      id: 'E003',
      date: '2024-01-15',
      time: '10:45',
      customer: 'Mike Johnson',
      route: 'Office → Station',
      distance: '12 km',
      baseFare: 280,
      tip: 0,
      total: 280,
      status: 'completed'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getCurrentData = () => {
    switch (tabValue) {
      case 0: return earningsData.today;
      case 1: return earningsData.week;
      case 2: return earningsData.month;
      default: return earningsData.today;
    }
  };

  const currentData = getCurrentData();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Earnings
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
        >
          Download Report
        </Button>
      </Box>

      {/* Period Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Today" />
          <Tab label="This Week" />
          <Tab label="This Month" />
        </Tabs>
      </Box>

      {/* Earnings Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4CAF50' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h5">₹{currentData.amount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Earnings
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
                  <Typography variant="h5">{currentData.rides}</Typography>
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
                <Avatar sx={{ bgcolor: '#FF9800' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h5">₹{currentData.tips}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tips Earned
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
                  <Typography variant="h5">{currentData.hours}h</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hours Online
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Earnings Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Earnings Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    dot={{ fill: '#4CAF50' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Average per Ride
                </Typography>
                <Typography variant="h6" color="success.main">
                  ₹{Math.round(currentData.amount / currentData.rides)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Hourly Rate
                </Typography>
                <Typography variant="h6" color="primary.main">
                  ₹{Math.round(currentData.amount / currentData.hours)}/hr
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Weekly Target Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  75% of ₹10,000 target
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Acceptance Rate
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={92} 
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  color="success"
                />
                <Typography variant="body2" color="text.secondary">
                  92% acceptance rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Earnings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Earnings
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={selectedPeriod}
                    label="Period"
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Route</TableCell>
                      <TableCell>Distance</TableCell>
                      <TableCell align="right">Base Fare</TableCell>
                      <TableCell align="right">Tip</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEarnings.map((earning) => (
                      <TableRow key={earning.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {earning.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {earning.time}
                          </Typography>
                        </TableCell>
                        <TableCell>{earning.customer}</TableCell>
                        <TableCell>{earning.route}</TableCell>
                        <TableCell>{earning.distance}</TableCell>
                        <TableCell align="right">₹{earning.baseFare}</TableCell>
                        <TableCell align="right">
                          {earning.tip > 0 ? `₹${earning.tip}` : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" color="success.main">
                            ₹{earning.total}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={earning.status} 
                            color="success" 
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Earnings;