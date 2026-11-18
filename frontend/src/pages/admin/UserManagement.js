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
  Tab
} from '@mui/material';
import {
  Person,
  Search,
  FilterList,
  Visibility,
  Edit,
  Block,
  Add,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const UserManagement = () => {
  const [users] = useState([
    {
      id: 'U001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
      role: 'customer',
      status: 'active',
      joinDate: '2023-08-15',
      lastActive: '2024-01-15T10:30:00Z',
      totalRides: 45,
      totalSpent: 12500,
      rating: 4.6
    },
    {
      id: 'U002',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 87654 32109',
      role: 'driver',
      status: 'active',
      joinDate: '2023-06-20',
      lastActive: '2024-01-15T14:20:00Z',
      totalRides: 156,
      totalEarnings: 45000,
      rating: 4.8
    },
    {
      id: 'U003',
      name: 'Admin User',
      email: 'admin@rydo.com',
      phone: '+91 76543 21098',
      role: 'admin',
      status: 'active',
      joinDate: '2023-01-01',
      lastActive: '2024-01-15T16:45:00Z',
      permissions: ['all']
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  const stats = {
    total: 2429,
    customers: 2340,
    drivers: 89,
    admins: 5,
    activeToday: 156
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#9c27b0';
      case 'driver': return '#2196f3';
      case 'customer': return '#4caf50';
      default: return '#757575';
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                         user.phone.includes(filters.search);
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesStatus = filters.status === 'all' || user.status === filters.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        👥 User Management
      </Typography>
      <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
        Manage all platform users - customers, drivers, and administrators
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">{stats.customers}</Typography>
              <Typography variant="body2" color="text.secondary">Customers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">{stats.drivers}</Typography>
              <Typography variant="body2" color="text.secondary">Drivers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary.main">{stats.admins}</Typography>
              <Typography variant="body2" color="text.secondary">Administrators</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{stats.activeToday}</Typography>
              <Typography variant="body2" color="text.secondary">Active Today</Typography>
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
                placeholder="Search users..."
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
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role}
                  label="Role"
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="driver">Driver</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
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
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
              >
                Advanced Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
              >
                Add User
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Users ({filteredUsers.length})
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {user.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role}
                        size="small"
                        sx={{
                          backgroundColor: `${getRoleColor(user.role)}15`,
                          color: getRoleColor(user.role)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastActive).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.role === 'customer' && (
                        <Typography variant="body2">
                          {user.totalRides} rides • ₹{user.totalSpent}
                        </Typography>
                      )}
                      {user.role === 'driver' && (
                        <Typography variant="body2">
                          {user.totalRides} rides • ₹{user.totalEarnings}
                        </Typography>
                      )}
                      {user.role === 'admin' && (
                        <Typography variant="body2">
                          Administrator
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(user)}
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

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          User Details - {selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Profile" />
                <Tab label="Activity" />
                <Tab label="Settings" />
              </Tabs>

              {/* Profile Tab */}
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1">{selectedUser.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{selectedUser.email}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{selectedUser.phone}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Role</Typography>
                      <Chip 
                        label={selectedUser.role}
                        size="small"
                        sx={{
                          backgroundColor: `${getRoleColor(selectedUser.role)}15`,
                          color: getRoleColor(selectedUser.role)
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Account Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip 
                        label={selectedUser.status} 
                        color={getStatusColor(selectedUser.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Join Date</Typography>
                      <Typography variant="body1">
                        {new Date(selectedUser.joinDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Last Active</Typography>
                      <Typography variant="body1">
                        {new Date(selectedUser.lastActive).toLocaleString()}
                      </Typography>
                    </Box>
                    {selectedUser.rating && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Rating</Typography>
                        <Typography variant="body1">{selectedUser.rating}/5</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              )}

              {/* Activity Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Activity Summary</Typography>
                  {selectedUser.role === 'customer' && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Typography variant="h6">{selectedUser.totalRides}</Typography>
                          <Typography variant="body2" color="text.secondary">Total Rides</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Typography variant="h6">₹{selectedUser.totalSpent}</Typography>
                          <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                  {selectedUser.role === 'driver' && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Typography variant="h6">{selectedUser.totalRides}</Typography>
                          <Typography variant="body2" color="text.secondary">Total Rides</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Typography variant="h6">₹{selectedUser.totalEarnings}</Typography>
                          <Typography variant="body2" color="text.secondary">Total Earnings</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}

              {/* Settings Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Account Settings</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Account management options and permissions would be configured here.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<Phone />}>
            Contact User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;