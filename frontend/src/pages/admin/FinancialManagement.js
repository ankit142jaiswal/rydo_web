import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  CreditCard,
  Receipt,
  Download,
  DateRange
} from '@mui/icons-material';

const FinancialManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');

  const financialStats = {
    totalRevenue: 1250000,
    revenueGrowth: 15.2,
    monthlyRevenue: 125000,
    monthlyGrowth: 8.5,
    driverEarnings: 875000,
    platformCommission: 375000,
    commissionRate: 30,
    pendingPayouts: 45000,
    completedPayouts: 830000
  };

  const revenueData = [
    { month: 'Jan', revenue: 95000, commission: 28500, payouts: 66500 },
    { month: 'Feb', revenue: 108000, commission: 32400, payouts: 75600 },
    { month: 'Mar', revenue: 125000, commission: 37500, payouts: 87500 },
    { month: 'Apr', revenue: 118000, commission: 35400, payouts: 82600 },
    { month: 'May', revenue: 135000, commission: 40500, payouts: 94500 },
    { month: 'Jun', revenue: 142000, commission: 42600, payouts: 99400 }
  ];

  const transactions = [
    {
      id: 'TXN001',
      type: 'ride_payment',
      amount: 650,
      commission: 195,
      driverEarning: 455,
      customer: 'John Doe',
      driver: 'Rajesh Kumar',
      paymentMethod: 'UPI',
      status: 'completed',
      date: '2024-01-15T14:30:00Z'
    },
    {
      id: 'TXN002',
      type: 'driver_payout',
      amount: 15000,
      driver: 'Amit Singh',
      paymentMethod: 'Bank Transfer',
      status: 'pending',
      date: '2024-01-15T10:00:00Z'
    },
    {
      id: 'TXN003',
      type: 'ride_payment',
      amount: 280,
      commission: 84,
      driverEarning: 196,
      customer: 'Sarah Wilson',
      driver: 'Suresh Patel',
      paymentMethod: 'Wallet',
      status: 'completed',
      date: '2024-01-14T18:45:00Z'
    }
  ];

  const paymentMethods = [
    { method: 'UPI', percentage: 45, amount: 562500, color: '#4caf50' },
    { method: 'Wallet', percentage: 30, amount: 375000, color: '#2196f3' },
    { method: 'Cash', percentage: 15, amount: 187500, color: '#ff9800' },
    { method: 'Card', percentage: 10, amount: 125000, color: '#9c27b0' }
  ];

  const driverPayouts = [
    {
      id: 'P001',
      driver: 'Rajesh Kumar',
      amount: 28000,
      rides: 89,
      commission: 12000,
      status: 'completed',
      date: '2024-01-15',
      method: 'Bank Transfer'
    },
    {
      id: 'P002',
      driver: 'Amit Singh',
      amount: 24500,
      rides: 76,
      commission: 10500,
      status: 'pending',
      date: '2024-01-15',
      method: 'Bank Transfer'
    },
    {
      id: 'P003',
      driver: 'Suresh Patel',
      amount: 21000,
      rides: 68,
      commission: 9000,
      status: 'processing',
      date: '2024-01-14',
      method: 'UPI'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'ride_payment': return '#4caf50';
      case 'driver_payout': return '#2196f3';
      case 'refund': return '#ff9800';
      default: return '#757575';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const StatCard = ({ title, value, growth, icon, format = 'currency' }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: growth >= 0 ? '#e8f5e8' : '#ffeaea',
            color: growth >= 0 ? '#2e7d32' : '#d32f2f'
          }}>
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {format === 'currency' ? `₹${value.toLocaleString()}` : 
               format === 'percentage' ? `${value}%` : value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {growth >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: '#2e7d32' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: '#d32f2f' }} />
              )}
              <Typography 
                variant="caption" 
                color={growth >= 0 ? 'success.main' : 'error.main'}
              >
                {Math.abs(growth)}%
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
        <Box>
          <Typography variant="h4" gutterBottom>
            💰 Financial Management
          </Typography>
          <Typography variant="body1" color="primary">
            Track revenue, manage payouts, and analyze financial performance
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Financial Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={financialStats.totalRevenue}
            growth={financialStats.revenueGrowth}
            icon={<AttachMoney />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={financialStats.monthlyRevenue}
            growth={financialStats.monthlyGrowth}
            icon={<TrendingUp />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Platform Commission"
            value={financialStats.platformCommission}
            growth={12.5}
            icon={<AccountBalance />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Payouts"
            value={financialStats.pendingPayouts}
            growth={-5.2}
            icon={<CreditCard />}
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Revenue Overview" />
          <Tab label="Transactions" />
          <Tab label="Driver Payouts" />
          <Tab label="Payment Methods" />
        </Tabs>
      </Box>

      {/* Revenue Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Revenue Breakdown
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Total Revenue</TableCell>
                        <TableCell align="right">Commission</TableCell>
                        <TableCell align="right">Driver Payouts</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revenueData.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell align="right">₹{row.revenue.toLocaleString()}</TableCell>
                          <TableCell align="right">₹{row.commission.toLocaleString()}</TableCell>
                          <TableCell align="right">₹{row.payouts.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Commission Rate
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {financialStats.commissionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Platform Commission
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Commission Distribution
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={financialStats.commissionRate} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    ₹{financialStats.platformCommission.toLocaleString()} collected this month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Transactions Tab */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Commission</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>
                        <Typography variant="subtitle2" color="primary">
                          {txn.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={txn.type.replace('_', ' ')}
                          size="small"
                          sx={{
                            backgroundColor: `${getTransactionTypeColor(txn.type)}15`,
                            color: getTransactionTypeColor(txn.type)
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          ₹{txn.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {txn.commission ? `₹${txn.commission}` : '-'}
                      </TableCell>
                      <TableCell>{txn.paymentMethod}</TableCell>
                      <TableCell>
                        <Chip 
                          label={txn.status} 
                          color={getStatusColor(txn.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(txn.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Driver Payouts Tab */}
      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Driver Payouts
              </Typography>
              <Button variant="contained" startIcon={<Receipt />}>
                Process Payouts
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payout ID</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>Rides</TableCell>
                    <TableCell align="right">Gross Earnings</TableCell>
                    <TableCell align="right">Commission</TableCell>
                    <TableCell align="right">Net Payout</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {driverPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <Typography variant="subtitle2" color="primary">
                          {payout.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{payout.driver}</TableCell>
                      <TableCell>{payout.rides}</TableCell>
                      <TableCell align="right">
                        ₹{(payout.amount + payout.commission).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ₹{payout.commission.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" color="success.main">
                          ₹{payout.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>
                        <Chip 
                          label={payout.status} 
                          color={getStatusColor(payout.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{payout.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Tab */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Method Distribution
                </Typography>
                {paymentMethods.map((method) => (
                  <Box key={method.method} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{method.method}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {method.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={method.percentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: '#f5f5f5',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: method.color
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      ₹{method.amount.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Insights
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Most Popular Payment Method
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    UPI (45%)
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Transaction Value
                  </Typography>
                  <Typography variant="h5">
                    ₹285
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Payment Success Rate
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    98.5%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FinancialManagement;