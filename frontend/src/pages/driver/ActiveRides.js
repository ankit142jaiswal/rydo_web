import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person,
  LocationOn,
  Phone,
  Navigation,
  AttachMoney
} from '@mui/icons-material';
import axios from 'axios';

const ActiveRides = () => {
  const [activeRides, setActiveRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchActiveRides();
  }, []);

  const fetchActiveRides = async () => {
    try {
      const response = await axios.get('/api/drivers/rides');
      if (response.data.success) {
        setActiveRides(response.data.rides.filter(ride => 
          ['accepted', 'started'].includes(ride.status)
        ));
      }
    } catch (error) {
      console.error('Error fetching active rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRideStatus = async (rideId, status) => {
    setProcessing(true);
    try {
      const response = await axios.put(`/api/rides/${rideId}/status`, { status });
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Ride status updated successfully' });
        fetchActiveRides(); // Refresh data
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update ride status' 
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCallCustomer = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`);
    }
  };

  const handleNavigate = (pickup, destination) => {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/${encodeURIComponent(pickup)}/${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  };

  const handleRideAction = (ride, action) => {
    if (action === 'start') {
      updateRideStatus(ride.rideId, 'started');
    } else if (action === 'complete') {
      updateRideStatus(ride.rideId, 'completed');
    }
  };

  const handleOtpVerification = () => {
    // In a real app, verify OTP with backend
    setDialogOpen(false);
    setOtpInput('');
    setMessage({ type: 'success', text: 'Customer pickup confirmed!' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'info';
      case 'started': return 'success';
      case 'completed': return 'default';
      default: return 'primary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Heading to Pickup';
      case 'started': return 'Customer Onboard';
      case 'completed': return 'Completed';
      default: return 'New Request';
    }
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
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}
      
      <Typography variant="h4" gutterBottom>
        Active Rides
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Rides ({activeRides.length})
              </Typography>
              {activeRides.length > 0 ? (
                <List>
                  {activeRides.map((ride, index) => (
                    <React.Fragment key={ride._id}>
                      <ListItem sx={{ px: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">{ride.customer?.name || 'Customer'}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(ride.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={getStatusText(ride.status)} 
                            color={getStatusColor(ride.status)}
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>From:</strong> {ride.pickup.address}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Navigation fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>To:</strong> {ride.destination.address}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoney fontSize="small" color="action" />
                            <Typography variant="body2">
                              Fare: ₹{ride.fare.total}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {ride.status === 'accepted' && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleRideAction(ride, 'start')}
                              disabled={processing}
                            >
                              Start Ride
                            </Button>
                          )}
                          {ride.status === 'started' && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleRideAction(ride, 'complete')}
                              disabled={processing}
                            >
                              Complete Ride
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Navigation />}
                            onClick={() => handleNavigate(ride.pickup.address, ride.destination.address)}
                          >
                            Navigate
                          </Button>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleCallCustomer(ride.customer?.phone)}
                          >
                            <Phone />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < activeRides.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No active rides. Go online to receive ride requests.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* OTP Verification Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Verify Customer OTP</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Ask the customer for their OTP to confirm pickup
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Enter OTP"
            type="text"
            fullWidth
            variant="outlined"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            inputProps={{ maxLength: 4 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleOtpVerification} variant="contained">
            Verify & Start Ride
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiveRides;