import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Notifications,
  Info,
  Warning,
  Error,
  CheckCircle,
  Delete,
  MarkAsUnread,
  MarkEmailRead
} from '@mui/icons-material';
import axios from 'axios';

const AdminNotifications = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (tabValue === 1) params.isRead = false;
      if (tabValue === 2) params.isRead = true;
      
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

  useEffect(() => {
    fetchNotifications();
  }, [tabValue]);

  const getNotificationIcon = (type) => {
    const icons = {
      info: <Info color="info" />,
      warning: <Warning color="warning" />,
      error: <Error color="error" />,
      success: <CheckCircle color="success" />
    };
    return icons[type] || <Notifications />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'error',
      high: 'warning',
      medium: 'info',
      low: 'default'
    };
    return colors[priority] || 'default';
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/api/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setMessage({ type: 'success', text: 'Notification marked as read' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to mark as read' 
      });
    }
  };

  const handleDelete = async (notificationId) => {
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
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
            Notifications
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Stay updated with platform activities and alerts
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark All as Read
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab 
              label={
                <Badge badgeContent={notifications.length} color="primary">
                  All
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={unreadCount} color="error">
                  Unread
                </Badge>
              } 
            />
            <Tab label="Read" />
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
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
                    sx={{
                      bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'transparent' }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight={notification.isRead ? 400 : 600}>
                            {notification.title}
                          </Typography>
                          <Chip 
                            label={notification.priority} 
                            size="small" 
                            color={getPriorityColor(notification.priority)}
                          />
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleMarkAsRead(notification._id)}
                        disabled={notification.isRead}
                      >
                        {notification.isRead ? <MarkEmailRead /> : <MarkAsUnread />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(notification._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminNotifications;