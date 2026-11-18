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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  Pagination,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Person,
  Search,
  FilterList,
  Visibility,
  Edit,
  Block,
  Star,
  Phone,
  Email,
  LocationOn,
  AttachMoney,
  DirectionsCar,
  AccountBalanceWallet
} from '@mui/icons-material';

const CustomerManagement = () => {
  const [customers] = useState([
    {
      id: 'C001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
      status: 'active',
      rating: 4.6,
      totalRides: 45,
      totalSpent: 12500,
      walletBalance: 850,
      joinDate: '2023-08-15',
      lastRideDate: '2024-01-15',
      preferredPayment: 'UPI',
      addresses: [
        { type: 'home', address: 'Sector 18, Noida, UP' },
        { type: 'work', address: 'Cyber City, Gurgaon, HR' }
      ],
      recentRides: [
        { date: '2024-01-15', destination: 'Airport', fare: 650 },
        { date: '2024-01-12', destination: 'Mall', fare: 280 }
      ]
    },
    {
      id: 'C002',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+91 87654 32109',
      status: 'active',
      rating: 4.8,
      totalRides: 78,
      totalSpent: 18900,
      walletBalance: 1200,
      joinDate: '2023-05-20',
      lastRideDate: '2024-01-14',
      preferredPayment: 'Wallet',
      addresses: [
        { type: 'home', address: 'DLF Phase 2, Gurgaon, HR' },
        { type: 'work', address: 'Connaught Place, Delhi' }
      ],
      recentRides: [
        { date: '2024-01-14', destination: 'Station', fare: 320 },
        { date: '2024-01-10', destination: 'Hospital', fare: 450 }
      ]
    },
    {
      id: 'C003',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+91 76543 21098',
      status: 'suspended',
      rating: 3.2,
      totalRides: 23,
      totalSpent: 5600,
      walletBalance: 0,
      joinDate: '2023-11-10',
      lastRideDate: '2024-01-08',
      preferredPayment: 'Cash',
      addresses: [
        { type: 'home', address: 'Lajpat Nagar, Delhi' }
      ],
      recentRides: [
        { date: '2024-01-08', destination: 'Office', fare: 180 },
        { date: '2024-01-05', destination: 'Market', fare: 120 }
      ]
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    rideRange: 'all'
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const customersPerPage = 10;

  const stats = {
    total: 2340,
    active: 2180,
    suspended: 160,
    newThisMonth: 145,
    totalRevenue: 1250000
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'error';
      case 'inactive': return 'warning';
      default: return 'default';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success.main';
    if (rating >= 3.5) return 'warning.main';
    return 'error.main';
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         customer.phone.includes(filters.search) ||
                         customer.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || customer.status === filters.status;
    const matchesRideRange = filters.rideRange === 'all' ||
                            (filters.rideRange === 'low' && customer.totalRides < 20) ||
                            (filters.rideRange === 'medium' && customer.totalRides >= 20 && customer.totalRides < 50) ||
                            (filters.rideRange === 'high' && customer.totalRides >= 50);
    
    return matchesSearch && matchesStatus && matchesRideRange;
  });

  const paginatedCustomers = filteredCustomers.slice((page - 1) * customersPerPage, page * customersPerPage);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        👥 Customer Management Dashboard
      </Typography>
      <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
        This is the Customer Management page - showing customer data and statistics
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Customers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">{stats.active}</Typography>
              <Typography variant="body2" color="text.secondary">Active</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">{stats.suspended}</Typography>
              <Typography variant="body2" color="text.secondary">Suspended</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">{stats.newThisMonth}</Typography>
              <Typography variant="body2" color="text.secondary">New This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6">₹{stats.totalRevenue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search customers..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Ride Count</InputLabel>
                <Select
                  value={filters.rideRange}
                  label="Ride Count"
                  onChange={(e) => handleFilterChange('rideRange', e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="low">Low (&lt;20)</MenuItem>
                  <MenuItem value="medium">Medium (20-50)</MenuItem>
                  <MenuItem value="high">High (&gt;50)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
              >
                Advanced Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customers ({filteredCustomers.length})
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Rides</TableCell>
                  <TableCell>Total Spent</TableCell>
                  <TableCell>Wallet Balance</TableCell>
                  <TableCell>Last Ride</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{customer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.phone}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={customer.status} 
                        color={getStatusColor(customer.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                        <Typography 
                          variant="body2" 
                          color={getRatingColor(customer.rating)}
                        >
                          {customer.rating}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{customer.totalRides}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="success.main">
                        ₹{customer.totalSpent.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ₹{customer.walletBalance}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(customer.lastRideDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(customer)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Block />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Customer Details - {selectedCustomer?.name}
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Personal Info" />
                <Tab label="Ride History" />
                <Tab label="Addresses" />
                <Tab label="Wallet & Payments" />
              </Tabs>

              {/* Personal Info Tab */}
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1">{selectedCustomer.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{selectedCustomer.email}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{selectedCustomer.phone}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Join Date</Typography>
                      <Typography variant="body1">
                        {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Account Statistics</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Account Status</Typography>
                      <Chip 
                        label={selectedCustomer.status} 
                        color={getStatusColor(selectedCustomer.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Customer Rating</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ color: '#FFD700' }} />
                        <Typography variant="body1">{selectedCustomer.rating}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Total Rides</Typography>
                      <Typography variant="body1">{selectedCustomer.totalRides}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                      <Typography variant="body1" color="success.main">
                        ₹{selectedCustomer.totalSpent.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {/* Ride History Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Recent Rides</Typography>
                  <List>
                    {selectedCustomer.recentRides.map((ride, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={`Ride to ${ride.destination}`}
                            secondary={`${ride.date} • ₹${ride.fare}`}
                          />
                        </ListItem>
                        {index < selectedCustomer.recentRides.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}

              {/* Addresses Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Saved Addresses</Typography>
                  <List>
                    {selectedCustomer.addresses.map((address, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                            secondary={address.address}
                          />
                        </ListItem>
                        {index < selectedCustomer.addresses.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}

              {/* Wallet & Payments Tab */}
              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Wallet & Payment Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Wallet Balance</Typography>
                        <Typography variant="h5">₹{selectedCustomer.walletBalance}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Preferred Payment</Typography>
                        <Typography variant="body1">{selectedCustomer.preferredPayment}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                        <Typography variant="h5" color="success.main">
                          ₹{selectedCustomer.totalSpent.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Average Ride Value</Typography>
                        <Typography variant="body1">
                          ₹{Math.round(selectedCustomer.totalSpent / selectedCustomer.totalRides)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Phone />}>
            Contact Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerManagement;