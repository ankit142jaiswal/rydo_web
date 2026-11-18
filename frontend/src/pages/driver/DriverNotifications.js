import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Notifications,
  DirectionsCar,
  LocalOffer,
  Info,
  Delete,
  MarkEmailRead,
  Assignment,
  Security
} from '@mui/icons-material';
import axios from 'axios';

const DriverNotifications = () => {
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
    security: true,
    earnings: true
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (tabValue === 1) params.isRead = false;
      if (tabValue === 2) params.type = 'ride_update';
      if (tabValue === 3) params.type = 'system';
      
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
  }, [tabValue]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ride_update': return <DirectionsCar />;
      case 'promotion': return <LocalOffer />;
      case 'system': return <Assignment />;
      case 'security': return <Security />;
      default: return <Info />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high' || priority === 'critical') return '#f44336';
    switch (type) {
      case 'ride_update': return '#2196f3';
      case 'promotion': return '#4caf50';
      case 'system': return '#ff9800';
      case 'security': return '#f44336';
      default: return '#757575';
    }
  };

  const getPriorityChip = (priority) => {
    const colors = {
      critical: 'error',
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

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.put('/api/notifications/mark-all-read');
      if (response.data.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setMessage({ type: 'success', text: 'All notifications marked as read' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to mark all as read' 
      });
    }
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
        <Button
          variant="outlined"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark All as Read
        </Button>
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
                    Total
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
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {notifications.filter(n => n.type === 'system').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    System
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Tab label="System" />
        </Tabs>
      </Box>

      {/* Notifications List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notifications ({notifications.length})
          </Typography>
          
          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No notifications found
              </Typography>
            </Box>
          ) : (
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
          )}
        </CardContent>
      </Card>

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
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}
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

export default DriverNotifications;