import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Avatar,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  Phone,
  Person,
  DirectionsCar
} from '@mui/icons-material';
import axios from 'axios';

const RideManagement = () => {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [editingRide, setEditingRide] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    cancellationReason: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    totalRides: 0,
    completedRides: 0,
    inProgressRides: 0,
    cancelledRides: 0,
    todayRevenue: 0
  });

  const ridesPerPage = 10;
  const totalPages = Math.ceil(filteredRides.length / ridesPerPage);
  const paginatedRides = filteredRides.slice((page - 1) * ridesPerPage, page * ridesPerPage);

  const fetchRides = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/rides');
      if (response.data.success) {
        setRides(response.data.rides);
        setFilteredRides(response.data.rides);
        calculateStats(response.data.rides);
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const calculateStats = (ridesData) => {
    const today = new Date().toDateString();
    const todayRides = ridesData.filter(r => new Date(r.createdAt).toDateString() === today);
    
    setStats({
      totalRides: ridesData.length,
      completedRides: ridesData.filter(r => r.status === 'completed').length,
      inProgressRides: ridesData.filter(r => r.status === 'started').length,
      cancelledRides: ridesData.filter(r => r.status === 'cancelled').length,
      todayRevenue: todayRides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.fare.total, 0)
    });
  };

  useEffect(() => {
    let filtered = rides;

    if (filters.search) {
      filtered = filtered.filter(ride =>
        ride.rideId.toLowerCase().includes(filters.search.toLowerCase()) ||
        ride.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        ride.driver.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(ride => ride.status === filters.status);
    }

    setFilteredRides(filtered);
    setPage(1);
  }, [filters, rides]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      started: 'primary',
      cancelled: 'error',
      requested: 'warning'
    };
    return colors[status] || 'default';
  };

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setDialogOpen(true);
  };

  const handleContactCustomer = (ride) => {
    if (ride.customer?.phone) {
      window.open(`tel:${ride.customer.phone}`);
    }
  };

  const handleEditRide = (ride) => {
    setEditingRide(ride);
    setEditForm({
      status: ride.status,
      cancellationReason: ride.cancellationReason || ''
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`/api/admin/rides/${editingRide._id}/status`, {
        status: editForm.status,
        cancellationReason: editForm.cancellationReason
      });
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Ride updated successfully' });
        setEditDialogOpen(false);
        fetchRides();
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update ride' 
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`/api/admin/users/${userId}`);
        if (response.data.success) {
          setMessage({ type: 'success', text: 'User deleted successfully' });
          fetchRides(); // Refresh data
        }
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to delete user' 
        });
      }
    }
  };

  const handleUpdateRideStatus = async (rideId, status) => {
    try {
      const response = await axios.put(`/api/admin/rides/${rideId}/status`, { status });
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Ride status updated successfully' });
        fetchRides(); // Refresh data
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update ride status' 
      });
    }
  };

  const handleAdvancedFilters = () => {
    // Open advanced filters dialog
    console.log('Open advanced filters');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
        Ride Management
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Monitor and manage all rides across the platform
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">{stats.totalRides}</Typography>
              <Typography variant="body2" color="text.secondary">Total Rides</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">{stats.completedRides}</Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">{stats.inProgressRides}</Typography>
              <Typography variant="body2" color="text.secondary">In Progress</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">{stats.cancelledRides}</Typography>
              <Typography variant="body2" color="text.secondary">Cancelled</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">₹{stats.todayRevenue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Today's Revenue</Typography>
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
                placeholder="Search rides..."
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="started">In Progress</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="requested">Requested</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleAdvancedFilters}
              >
                Advanced Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Rides Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Rides ({filteredRides.length})
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ride ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Fare</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRides.map((ride) => (
                  <TableRow key={ride._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" color="primary">
                        {ride.rideId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{ride.customer?.name || 'N/A'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ride.customer?.phone || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <DirectionsCar />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{ride.driver?.name || 'Unassigned'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ride.driver?.phone || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {ride.pickup.address} → {ride.destination.address}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ride.distance} km • {ride.duration} mins
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ride.status.replace('_', ' ')} 
                        color={getStatusColor(ride.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" color="success.main">
                        ₹{ride.fare.total}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ride.payment.method}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(ride)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditRide(ride)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
          Ride Details - {selectedRide?.rideId}
        </DialogTitle>
        <DialogContent>
          {selectedRide && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Trip Information</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body1">
                    {new Date(selectedRide.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Pickup Location</Typography>
                  <Typography variant="body1">{selectedRide.pickup.address}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Destination</Typography>
                  <Typography variant="body1">{selectedRide.destination.address}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Payment & Status</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1">{selectedRide.customer?.name || 'N/A'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Driver</Typography>
                  <Typography variant="body1">{selectedRide.driver?.name || 'Unassigned'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Fare</Typography>
                  <Typography variant="h6" color="success.main">₹{selectedRide.fare.total}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<Phone />}
            onClick={() => handleContactCustomer(selectedRide)}
          >
            Contact Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Ride Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Ride - {editingRide?.rideId}
        </DialogTitle>
        <DialogContent>
          {editingRide && (
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status}
                  label="Status"
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="requested">Requested</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="started">Started</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              
              {editForm.status === 'cancelled' && (
                <TextField
                  fullWidth
                  label="Cancellation Reason"
                  multiline
                  rows={3}
                  value={editForm.cancellationReason}
                  onChange={(e) => setEditForm(prev => ({ ...prev, cancellationReason: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              )}
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Ride Information</Typography>
                <Typography variant="body2">Customer: {editingRide.customer?.name}</Typography>
                <Typography variant="body2">Driver: {editingRide.driver?.name || 'Unassigned'}</Typography>
                <Typography variant="body2">Route: {editingRide.pickup.address} → {editingRide.destination.address}</Typography>
                <Typography variant="body2">Fare: ₹{editingRide.fare.total}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEdit}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RideManagement;