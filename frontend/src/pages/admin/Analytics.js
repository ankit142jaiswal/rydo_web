import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  DirectionsCar,
  People,
  AttachMoney,
  Schedule,
  LocationOn,
  Star
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [tabValue, setTabValue] = useState(0);

  const revenueData = [
    { name: 'Mon', revenue: 15000, rides: 120, drivers: 45 },
    { name: 'Tue', revenue: 18500, rides: 150, drivers: 52 },
    { name: 'Wed', revenue: 12000, rides: 90, drivers: 38 },
    { name: 'Thu', revenue: 22000, rides: 180, drivers: 58 },
    { name: 'Fri', revenue: 28000, rides: 210, drivers: 65 },
    { name: 'Sat', revenue: 32000, rides: 250, drivers: 72 },
    { name: 'Sun', revenue: 26000, rides: 200, drivers: 60 }
  ];

  const serviceTypeData = [
    { name: 'Economy', value: 65, color: '#2196f3' },
    { name: 'Premium', value: 25, color: '#ff9800' },
    { name: 'Luxury', value: 10, color: '#9c27b0' }
  ];

  const hourlyData = [
    { hour: '6AM', rides: 15 }, { hour: '7AM', rides: 35 }, { hour: '8AM', rides: 65 },
    { hour: '9AM', rides: 85 }, { hour: '10AM', rides: 45 }, { hour: '11AM', rides: 35 },
    { hour: '12PM', rides: 55 }, { hour: '1PM', rides: 65 }, { hour: '2PM', rides: 45 },
    { hour: '3PM', rides: 35 }, { hour: '4PM', rides: 25 }, { hour: '5PM', rides: 45 },
    { hour: '6PM', rides: 75 }, { hour: '7PM', rides: 95 }, { hour: '8PM', rides: 85 },
    { hour: '9PM', rides: 65 }, { hour: '10PM', rides: 45 }, { hour: '11PM', rides: 25 }
  ];

  const topRoutes = [
    { route: 'Airport → Downtown', rides: 156, revenue: 98000 },
    { route: 'Mall → Station', rides: 134, revenue: 45000 },
    { route: 'Office → Residential', rides: 98, revenue: 32000 },
    { route: 'Hospital → Home', rides: 87, revenue: 28000 },
    { route: 'University → Mall', rides: 76, revenue: 22000 }
  ];

  const topDrivers = [
    { name: 'Rajesh Kumar', rides: 89, rating: 4.9, earnings: 28000 },
    { name: 'Amit Singh', rides: 76, rating: 4.8, earnings: 24500 },
    { name: 'Suresh Patel', rides: 68, rating: 4.7, earnings: 21000 },
    { name: 'Vikram Sharma', rides: 65, rating: 4.8, earnings: 20500 },
    { name: 'Ravi Gupta', rides: 62, rating: 4.6, earnings: 19800 }
  ];

  const kpiData = {
    totalRevenue: 125000,
    revenueGrowth: 12.5,
    totalRides: 1256,
    ridesGrowth: 8.3,
    avgRideValue: 285,
    rideValueGrowth: 5.2,
    customerSatisfaction: 4.7,
    satisfactionGrowth: 2.1,
    driverUtilization: 78,
    utilizationGrowth: -1.5,
    cancellationRate: 8.5,
    cancellationChange: -2.3
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (value) => `₹${value.toLocaleString()}`;

  const KPICard = ({ title, value, growth, icon, format = 'number' }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            backgroundColor: growth >= 0 ? '#e8f5e8' : '#ffeaea',
            color: growth >= 0 ? '#2e7d32' : '#d32f2f'
          }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {format === 'currency' ? formatCurrency(value) : 
               format === 'percentage' ? `${value}%` : value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {growth >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: '#2e7d32' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: '#d32f2f' }} />
              )}
              <Typography 
                variant="caption" 
                color={growth >= 0 ? 'success.main' : 'error.main'}
                fontWeight="medium"
              >
                {Math.abs(growth)}% {growth >= 0 ? 'increase' : 'decrease'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          📊 Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
          This is the Analytics page - showing business metrics and reports
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Total Revenue"
            value={kpiData.totalRevenue}
            growth={kpiData.revenueGrowth}
            icon={<AttachMoney />}
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Total Rides"
            value={kpiData.totalRides}
            growth={kpiData.ridesGrowth}
            icon={<DirectionsCar />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Avg Ride Value"
            value={kpiData.avgRideValue}
            growth={kpiData.rideValueGrowth}
            icon={<TrendingUp />}
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Customer Satisfaction"
            value={kpiData.customerSatisfaction}
            growth={kpiData.satisfactionGrowth}
            icon={<Star />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Driver Utilization"
            value={kpiData.driverUtilization}
            growth={kpiData.utilizationGrowth}
            icon={<People />}
            format="percentage"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Cancellation Rate"
            value={kpiData.cancellationRate}
            growth={kpiData.cancellationChange}
            icon={<Schedule />}
            format="percentage"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Revenue & Rides" />
          <Tab label="Service Analysis" />
          <Tab label="Performance" />
          <Tab label="Geographic" />
        </Tabs>
      </Box>

      {/* Revenue & Rides Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue & Rides Trend
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a1a2e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1a1a2e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4caf50" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#1a1a2e" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)"
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="rides" 
                      stroke="#4caf50" 
                      fillOpacity={1} 
                      fill="url(#colorRides)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hourly Ride Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rides" fill="#1a1a2e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Service Analysis Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Service Type Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Routes
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Route</TableCell>
                        <TableCell align="right">Rides</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topRoutes.map((route, index) => (
                        <TableRow key={index}>
                          <TableCell>{route.route}</TableCell>
                          <TableCell align="right">{route.rides}</TableCell>
                          <TableCell align="right">{formatCurrency(route.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Performance Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Performing Drivers
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Driver</TableCell>
                        <TableCell align="right">Rides</TableCell>
                        <TableCell align="right">Rating</TableCell>
                        <TableCell align="right">Earnings</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topDrivers.map((driver, index) => (
                        <TableRow key={index}>
                          <TableCell>{driver.name}</TableCell>
                          <TableCell align="right">{driver.rides}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                              {driver.rating}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{formatCurrency(driver.earnings)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Average Response Time
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    3.2 minutes (Target: 5 min)
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Driver Acceptance Rate
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={92} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    color="success"
                  />
                  <Typography variant="body2" color="text.secondary">
                    92% (Target: 90%)
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Customer Retention Rate
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={78} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    color="warning"
                  />
                  <Typography variant="body2" color="text.secondary">
                    78% (Target: 85%)
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Peak Hour Coverage
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={95} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    color="success"
                  />
                  <Typography variant="body2" color="text.secondary">
                    95% (Target: 90%)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Geographic Tab */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Geographic Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 10 }}>
                  Interactive map showing ride density, popular routes, and driver distribution across the city.
                  <br />
                  Map integration would be implemented here using services like Google Maps or Mapbox.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Analytics;
