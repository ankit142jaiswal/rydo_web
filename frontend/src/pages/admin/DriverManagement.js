import React, { useState } from 'react';
import axios from 'axios';
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
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Search,
  FilterList,
  Visibility,
  Edit,
  Block,
  CheckCircle,
  DirectionsCar,
  Star,
  Phone,
  Email,
  LocationOn,
  Verified,
  Warning,
  Description
} from '@mui/icons-material';

const DriverManagement = () => {
  console.log('DriverManagement component loaded');
  
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    verificationStatus: 'all',
    isOnline: 'all'
  });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const driversPerPage = 10;

  // Fetch drivers from API
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      // Add timestamp to prevent caching
      const response = await axios.get(`/api/admin/users?role=driver&t=${Date.now()}`);
      if (response.data.success) {
        setDrivers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      // Fallback to mock data if API fails
      setDrivers([
        {
          _id: 'D001',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91 98765 43210',
          role: 'driver',
          status: 'active',
          driverDetails: {
            licenseNumber: 'DL123456789',
            verificationStatus: 'verified',
            isOnline: true,
            rating: 4.8,
            totalRides: 156,
            earnings: 45000,
            vehicle: {
              make: 'Maruti Suzuki',
              model: 'Swift Dzire',
              year: '2020',
              plateNumber: 'DL 01 AB 1234',
              color: 'White'
            }
          },
          createdAt: '2023-06-15'
        },
        {
          _id: 'D002',
          name: 'Amit Singh',
          email: 'amit.singh@email.com',
          phone: '+91 87654 32109',
          role: 'driver',
          status: 'active',
          driverDetails: {
            licenseNumber: 'DL987654321',
            verificationStatus: 'pending',
            isOnline: false,
            rating: 4.9,
            totalRides: 203,
            earnings: 62000,
            vehicle: {
              make: 'Honda',
              model: 'City',
              year: '2019',
              plateNumber: 'DL 02 CD 5678',
              color: 'Silver'
            }
          },
          createdAt: '2023-04-20'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDrivers();
  }, []);

  const stats = {
    total: 89,
    active: 67,
    online: 45,
    pending: 12,
    suspended: 10
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'expired': return 'error';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setDialogOpen(true);
  };

  const handleEditDriver = (driver) => {
    setEditingDriver(driver);
    setEditDialogOpen(true);
  };

  const handleBlockDriver = async (driver) => {
    try {
      const newStatus = driver.status === 'active' ? 'suspended' : 'active';
      
      // API call to update driver status
      const response = await axios.put(`/api/admin/drivers/${driver._id}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update local state with the response data
        setDrivers(prev => prev.map(d => 
          d._id === driver._id ? response.data.driver : d
        ));
        alert(`Driver ${driver.name} has been ${newStatus === 'suspended' ? 'blocked' : 'unblocked'}`);
        // Refresh data from server to ensure consistency
        setTimeout(() => fetchDrivers(), 500);
      }
    } catch (error) {
      console.error('Error updating driver status:', error);
      alert('Failed to update driver status');
    }
  };

  const handleTabChange = async (event, newValue) => {
    try {
      setTabValue(newValue);
      // Log tab change activity
      await axios.post('/api/admin/activity-log', {
        action: 'tab-change',
        tab: newValue,
        section: 'driver-details'
      });
    } catch (error) {
      console.error('Error logging tab change:', error);
      setTabValue(newValue); // Still update tab even if logging fails
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         driver.phone.includes(filters.search) ||
                         driver.driverDetails?.vehicle?.plateNumber?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || driver.status === filters.status;
    const matchesVerification = filters.verificationStatus === 'all' || driver.driverDetails?.verificationStatus === filters.verificationStatus;
    const matchesOnline = filters.isOnline === 'all' || 
                         (filters.isOnline === 'online' && driver.driverDetails?.isOnline) ||
                         (filters.isOnline === 'offline' && !driver.driverDetails?.isOnline);
    
    return matchesSearch && matchesStatus && matchesVerification && matchesOnline;
  });

  const paginatedDrivers = filteredDrivers.slice((page - 1) * driversPerPage, page * driversPerPage);
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🚗 Driver Management Dashboard
      </Typography>
      <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
        This is the Driver Management page - showing driver data and statistics
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Drivers</Typography>
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
              <Typography variant="h6" color="primary.main">{stats.online}</Typography>
              <Typography variant="body2" color="text.secondary">Online Now</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">{stats.pending}</Typography>
              <Typography variant="body2" color="text.secondary">Pending Verification</Typography>
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
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search drivers..."
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
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Verification</InputLabel>
                <Select
                  value={filters.verificationStatus}
                  label="Verification"
                  onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Online Status</InputLabel>
                <Select
                  value={filters.isOnline}
                  label="Online Status"
                  onChange={(e) => handleFilterChange('isOnline', e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={async () => {
                  try {
                    const response = await axios.get('/api/admin/drivers/advanced-filters');
                    if (response.data.success) {
                      console.log('Advanced filters loaded:', response.data.filters);
                      alert('Advanced filters loaded!');
                    }
                  } catch (error) {
                    console.error('Error loading advanced filters:', error);
                  }
                }}
              >
                Advanced Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Drivers ({filteredDrivers.length})
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Driver</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Verification</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Rides</TableCell>
                  <TableCell>Earnings</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDrivers.map((driver) => (
                  <TableRow key={driver._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>
                          <Person />
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">{driver.name}</Typography>
                            {driver.driverDetails?.isOnline && (
                              <Chip label="Online" color="success" size="small" />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {driver.phone}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Joined: {new Date(driver.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {driver.driverDetails?.vehicle?.make} {driver.driverDetails?.vehicle?.model}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {driver.driverDetails?.vehicle?.plateNumber} • {driver.driverDetails?.vehicle?.year}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={driver.status} 
                        color={getStatusColor(driver.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={driver.driverDetails?.verificationStatus || 'pending'} 
                          color={getVerificationColor(driver.driverDetails?.verificationStatus || 'pending')}
                          size="small"
                        />
                        {driver.driverDetails?.verificationStatus === 'verified' && (
                          <Verified color="success" fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                        <Typography variant="body2">{driver.driverDetails?.rating || 0}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{driver.driverDetails?.totalRides || 0}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="success.main">
                        ₹{(driver.driverDetails?.earnings || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(driver)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleEditDriver(driver)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color={driver.status === 'active' ? 'error' : 'success'}
                        onClick={() => handleBlockDriver(driver)}
                      >
                        {driver.status === 'active' ? <Block /> : <CheckCircle />}
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
              onChange={async (e, value) => {
                try {
                  setPage(value);
                  // Log pagination activity
                  await axios.post('/api/admin/activity-log', {
                    action: 'pagination',
                    page: value,
                    section: 'driver-management'
                  });
                } catch (error) {
                  console.error('Error logging pagination:', error);
                  setPage(value); // Still update page even if logging fails
                }
              }}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Driver Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Driver Details - {selectedDriver?.name}
        </DialogTitle>
        <DialogContent>
          {selectedDriver && (
            <Box>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Personal Info" />
                <Tab label="Vehicle Details" />
                <Tab label="Documents" />
                <Tab label="Performance" />
              </Tabs>

              {/* Personal Info Tab */}
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1">{selectedDriver.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{selectedDriver.email}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{selectedDriver.phone}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">License Number</Typography>
                      <Typography variant="body1">{selectedDriver.driverDetails?.licenseNumber}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Status Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Account Status</Typography>
                      <Chip 
                        label={selectedDriver.status} 
                        color={getStatusColor(selectedDriver.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Verification Status</Typography>
                      <Chip 
                        label={selectedDriver.driverDetails?.verificationStatus || 'pending'} 
                        color={getVerificationColor(selectedDriver.driverDetails?.verificationStatus || 'pending')}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Online Status</Typography>
                      <Chip 
                        label={selectedDriver.driverDetails?.isOnline ? 'Online' : 'Offline'} 
                        color={selectedDriver.driverDetails?.isOnline ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Join Date</Typography>
                      <Typography variant="body1">
                        {new Date(selectedDriver.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {/* Vehicle Details Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Make & Model</Typography>
                        <Typography variant="body1">
                          {selectedDriver.driverDetails?.vehicle?.make} {selectedDriver.driverDetails?.vehicle?.model}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Year</Typography>
                        <Typography variant="body1">{selectedDriver.driverDetails?.vehicle?.year}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Color</Typography>
                        <Typography variant="body1">{selectedDriver.driverDetails?.vehicle?.color}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">License Plate</Typography>
                        <Typography variant="body1">{selectedDriver.driverDetails?.vehicle?.plateNumber}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Documents Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Document Status</Typography>
                  <List>
                    {selectedDriver.driverDetails?.documents ? Object.entries(selectedDriver.driverDetails.documents).map(([docType, docInfo]) => (
                      <React.Fragment key={docType}>
                        <ListItem>
                          <ListItemIcon>
                            <Description />
                          </ListItemIcon>
                          <ListItemText
                            primary={docType.charAt(0).toUpperCase() + docType.slice(1)}
                            secondary={`Expires: ${new Date(docInfo.expiryDate).toLocaleDateString()}`}
                          />
                          <Chip
                            label={docInfo.status}
                            color={getDocumentStatusColor(docInfo.status)}
                            size="small"
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    )) : (
                      <Typography variant="body2" color="text.secondary">
                        No document information available
                      </Typography>
                    )}
                  </List>
                </Box>
              )}

              {/* Performance Tab */}
              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Total Rides</Typography>
                        <Typography variant="h5">{selectedDriver.driverDetails?.totalRides || 0}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star sx={{ color: '#FFD700' }} />
                          <Typography variant="h5">{selectedDriver.driverDetails?.rating || 0}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Total Earnings</Typography>
                        <Typography variant="h5" color="success.main">
                          ₹{(selectedDriver.driverDetails?.earnings || 0).toLocaleString()}
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
          <Button
            variant="contained"
            startIcon={<Phone />}
            onClick={async () => {
              try {
                const response = await axios.post('/api/admin/drivers/contact', {
                  driverId: selectedDriver._id,
                  message: 'Admin contacted driver'
                });
                if (response.data.success) {
                  alert('Driver contacted successfully!');
                } else {
                  alert('Failed to contact driver');
                }
              } catch (error) {
                console.error('Error contacting driver:', error);
                alert('Failed to contact driver');
              }
            }}
          >
            Contact Driver
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Driver Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Driver - {editingDriver?.name}
        </DialogTitle>
        <DialogContent>
          {editingDriver && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editingDriver.status}
                      label="Status"
                      onChange={(e) => setEditingDriver({...editingDriver, status: e.target.value})}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="suspended">Suspended</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Verification Status</InputLabel>
                    <Select
                      value={editingDriver.driverDetails?.verificationStatus || 'pending'}
                      label="Verification Status"
                      onChange={(e) => setEditingDriver({
                        ...editingDriver, 
                        driverDetails: {
                          ...editingDriver.driverDetails,
                          verificationStatus: e.target.value
                        }
                      })}
                    >
                      <MenuItem value="verified">Verified</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={editingDriver.phone}
                    onChange={(e) => setEditingDriver({...editingDriver, phone: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={editingDriver.email}
                    onChange={(e) => setEditingDriver({...editingDriver, email: e.target.value})}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={async () => {
              try {
                // API call to update driver
                const response = await axios.put(`/api/admin/drivers/${editingDriver._id}`, {
                  status: editingDriver.status,
                  verificationStatus: editingDriver.driverDetails?.verificationStatus,
                  phone: editingDriver.phone,
                  email: editingDriver.email
                });
                
                if (response.data.success) {
                  // Update the drivers state with the response data
                  setDrivers(prev => prev.map(d => 
                    d._id === editingDriver._id ? response.data.driver : d
                  ));
                  alert('Driver details updated successfully!');
                  setEditDialogOpen(false);
                  // Refresh data from server to ensure consistency
                  setTimeout(() => fetchDrivers(), 500);
                } else {
                  alert('Failed to update driver details');
                }
              } catch (error) {
                console.error('Error updating driver:', error);
                alert('Failed to update driver details');
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverManagement;