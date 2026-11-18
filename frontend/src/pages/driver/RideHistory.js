import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Star,
  Person,
  LocationOn,
  AttachMoney,
  CalendarToday,
  Download
} from '@mui/icons-material';

const RideHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRide, setSelectedRide] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const ridesPerPage = 10;

  const rideHistory = [
    {
      id: 'RH001',
      date: '2024-01-15',
      time: '14:30',
      customer: 'John Doe',
      customerPhone: '+91 98765 43210',
      pickup: 'Connaught Place, Delhi',
      destination: 'IGI Airport, Delhi',
      distance: '28 km',
      duration: '45 min',
      baseFare: 650,
      tip: 100,
      total: 750,
      status: 'completed',
      rating: 5,
      customerRating: 4.8,
      feedback: 'Great ride! Very professional driver.',
      paymentMethod: 'UPI'
    },
    {
      id: 'RH002',
      date: '2024-01-15',
      time: '12:15',
      customer: 'Sarah Wilson',
      customerPhone: '+91 87654 32109',
      pickup: 'DLF Mall, Gurgaon',
      destination: 'Cyber City, Gurgaon',
      distance: '12 km',
      duration: '25 min',
      baseFare: 280,
      tip: 50,
      total: 330,
      status: 'completed',
      rating: 4,
      customerRating: 4.9,
      feedback: 'Good service, on time pickup.',
      paymentMethod: 'Cash'
    },
    {
      id: 'RH003',
      date: '2024-01-14',
      time: '18:45',
      customer: 'Mike Johnson',
      customerPhone: '+91 76543 21098',
      pickup: 'Metro Station, Noida',
      destination: 'Sector 18, Noida',
      distance: '8 km',
      duration: '20 min',
      baseFare: 180,
      tip: 0,
      total: 180,
      status: 'completed',
      rating: 3,
      customerRating: 4.7,
      feedback: 'Average ride, could be better.',
      paymentMethod: 'Wallet'
    },
    {
      id: 'RH004',
      date: '2024-01-14',
      time: '16:20',
      customer: 'Emily Davis',
      customerPhone: '+91 65432 10987',
      pickup: 'India Gate, Delhi',
      destination: 'Red Fort, Delhi',
      distance: '5 km',
      duration: '15 min',
      baseFare: 120,
      tip: 20,
      total: 140,
      status: 'cancelled',
      rating: null,
      customerRating: 4.6,
      feedback: 'Customer cancelled after pickup.',
      paymentMethod: 'UPI'
    }
  ];

  const filteredRides = rideHistory.filter(ride => {
    const matchesSearch = ride.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && ride.date === '2024-01-15') ||
                       (dateFilter === 'week' && ['2024-01-15', '2024-01-14'].includes(ride.date));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const paginatedRides = filteredRides.slice((page - 1) * ridesPerPage, page * ridesPerPage);
  const totalPages = Math.ceil(filteredRides.length / ridesPerPage);

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Ride History
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
        >
          Export History
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4CAF50' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6">156</Typography>
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
                <Avatar sx={{ bgcolor: '#2196F3' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">₹45,280</Typography>
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
                <Avatar sx={{ bgcolor: '#FF9800' }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6">4.7</Typography>
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
                <Avatar sx={{ bgcolor: '#9C27B0' }}>
                  <CalendarToday />
                </Avatar>
                <Box>
                  <Typography variant="h6">95%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completion Rate
                  </Typography>
                </Box>
              </Box>
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
                placeholder="Search by customer, pickup, or destination"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date Range"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Ride History Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ride History ({filteredRides.length} rides)
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Distance</TableCell>
                  <TableCell align="right">Earnings</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRides.map((ride) => (
                  <TableRow key={ride.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {ride.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ride.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <Person />
                        </Avatar>
                        <Typography variant="body2">
                          {ride.customer}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {ride.pickup} → {ride.destination}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {ride.distance}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ride.duration}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" color="success.main">
                        ₹{ride.total}
                      </Typography>
                      {ride.tip > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          (₹{ride.tip} tip)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {ride.rating ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Rating value={ride.rating} size="small" readOnly />
                          <Typography variant="caption">
                            ({ride.rating})
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No rating
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusText(ride.status)} 
                        color={getStatusColor(ride.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(ride)}
                      >
                        <Visibility />
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

      {/* Ride Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Ride Details - {selectedRide?.id}
        </DialogTitle>
        <DialogContent>
          {selectedRide && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Trip Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body1">{selectedRide.date} at {selectedRide.time}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Pickup Location</Typography>
                  <Typography variant="body1">{selectedRide.pickup}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Destination</Typography>
                  <Typography variant="body1">{selectedRide.destination}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Distance & Duration</Typography>
                  <Typography variant="body1">{selectedRide.distance} • {selectedRide.duration}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer & Payment
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1">{selectedRide.customer}</Typography>
                  <Typography variant="caption" color="text.secondary">{selectedRide.customerPhone}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                  <Typography variant="body1">{selectedRide.paymentMethod}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Fare Breakdown</Typography>
                  <Typography variant="body1">Base Fare: ₹{selectedRide.baseFare}</Typography>
                  <Typography variant="body1">Tip: ₹{selectedRide.tip}</Typography>
                  <Typography variant="subtitle1" color="success.main">Total: ₹{selectedRide.total}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Rating & Feedback</Typography>
                  {selectedRide.rating ? (
                    <Box>
                      <Rating value={selectedRide.rating} readOnly />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        "{selectedRide.feedback}"
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No rating provided
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RideHistory;