import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Badge,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Collapse
} from '@mui/material';
import {
  Notifications,
  DirectionsCar,
  LocalOffer,
  Info,
  CheckCircle,
  Delete,
  MarkEmailRead,
  Settings,
  Security,
  Update,
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear
} from '@mui/icons-material';
import axios from 'axios';

const CustomerNotifications = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [notificationSettings, setNotificationSettings] = useState({
    rideUpdates: true,
    promotions: true,
    systemUpdates: true,
    security: true
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    isRead: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Tab-based filtering
      if (tabValue === 1) params.isRead = false;
      if (tabValue === 2) params.type = 'ride_update';
      if (tabValue === 3) params.type = 'promotion';
      
      // Advanced filtering
      if (filters.type) params.type = filters.type;
      if (filters.priority) params.priority = filters.priority;
      if (filters.isRead !== '') params.isRead = filters.isRead === 'true';
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.search) params.search = filters.search;
      
      const response = await axios.get('/api/notifications', { params });
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to fetch notifications' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/notifications/settings');
      if (response.data.success) {
        setNotificationSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, [tabValue, filters]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ride_update': return <DirectionsCar />;
      case 'promotion': return <LocalOffer />;
      case 'system': return <Update />;
      case 'security': return <Security />;
      default: return <Info />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return '#f44336';
    switch (type) {
      case 'ride_update': return '#2196f3';
      case 'promotion': return '#ff9800';
      case 'system': return '#9c27b0';
      case 'security': return '#f44336';
      default: return '#757575';
    }
  };

  const getPriorityChip = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return (
      <Chip 
        label={priority.toUpperCase()} 
        color={colors[priority]} 
        size="small"
      />
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setDialogOpen(true);
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  const handleSettingChange = async (setting) => {
    const newSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    };
    
    setNotificationSettings(newSettings);
    
    try {
      const response = await axios.put('/api/notifications/settings', newSettings);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      // Revert on error
      setNotificationSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update settings' 
      });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/api/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        setMessage({ type: 'success', text: 'Notification deleted' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to delete notification' 
      });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      priority: '',
      isRead: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<Settings />}
          >
            Settings
          </Button>
        </Box>
      </Box>

      {/* Notification Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#2196f3' }}>
                  <Notifications />
                </Avatar>
                <Box>
                  <Typography variant="h6">{notifications.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Notifications
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
                <Avatar sx={{ bgcolor: '#f44336' }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <MarkEmailRead />
                  </Badge>
                </Avatar>
                <Box>
                  <Typography variant="h6">{unreadCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unread
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
                <Avatar sx={{ bgcolor: '#2196f3' }}>
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {notifications.filter(n => n.type === 'ride_update').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ride Updates
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
                <Avatar sx={{ bgcolor: '#ff9800' }}>
                  <LocalOffer />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {notifications.filter(n => n.type === 'promotion').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Offers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={showFilters}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Advanced Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search notifications..."
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Type"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="ride_update">Ride Updates</MenuItem>
                    <MenuItem value="promotion">Promotions</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filters.priority}
                    label="Priority"
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                  >
                    <MenuItem value="">All Priorities</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.isRead}
                    label="Status"
                    onChange={(e) => handleFilterChange('isRead', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="false">Unread</MenuItem>
                    <MenuItem value="true">Read</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={1.5}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1.5}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Notification Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab 
            label={
              <Badge badgeContent={unreadCount} color="error">
                Unread
              </Badge>
            } 
          />
          <Tab label="Ride Updates" />
          <Tab label="Offers" />
        </Tabs>
      </Box>

      {/* Notifications List */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications ({notifications.length})
              </Typography>
              
              <List>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification._id}>
                    <ListItem
                      button
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: getNotificationColor(notification.type, notification.priority),
                            width: 40,
                            height: 40
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography 
                              variant="subtitle1" 
                              fontWeight={notification.isRead ? 400 : 600}
                            >
                              {notification.title}
                            </Typography>
                            {getPriorityChip(notification.priority)}
                            {notification.actionRequired && (
                              <Chip label="Action Required" color="warning" size="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notification.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.rideUpdates}
                      onChange={() => handleSettingChange('rideUpdates')}
                    />
                  }
                  label="Ride Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.promotions}
                      onChange={() => handleSettingChange('promotions')}
                    />
                  }
                  label="Promotions & Offers"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onChange={() => handleSettingChange('systemUpdates')}
                    />
                  }
                  label="System Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.security}
                      onChange={() => handleSettingChange('security')}
                    />
                  }
                  label="Security Alerts"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedNotification?.title}
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedNotification.message}
              </Typography>
              
              {selectedNotification.details && Object.keys(selectedNotification.details).length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  {Object.entries(selectedNotification.details).map(([key, value]) => (
                    <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                    </Typography>
                  ))}
                </Box>
              )}
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerNotifications;