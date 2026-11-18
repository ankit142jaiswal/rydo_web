import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Divider
} from '@mui/material';
import {
  DirectionsCar,
  Person,
  LocationOn,
  AccessTime,
  AttachMoney,
  Star,
  Phone,
  Navigation,
  Cancel,
  Refresh,
  Feedback
} from '@mui/icons-material';

const CustomerRides = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRide, setSelectedRide] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const activeRides = [
    {
      id: 'AR001',
      driver: 'Rajesh Kumar',
      driverPhone: '+91 98765 43210',
      vehicle: 'Swift Dzire - DL 01 AB 1234',
      pickup: 'Connaught Place, Delhi',
      destination: 'IGI Airport, Delhi',
      status: 'driver_assigned',
      fare: 650,
      bookingTime: '2024-01-15T14:30:00Z',
      eta: '5 min',
      driverRating: 4.8
    }
  ];

  const rideHistory = [
    {
      id: 'RH001',
      driver: 'Amit Singh',
      vehicle: 'Honda City',
      pickup: 'Home',
      destination: 'Office',
      date: '2024-01-14',
      fare: 280,
      status: 'completed',
      rating: 5,
      driverRating: 4.9
    },
    {
      id: 'RH002',
      driver: 'Suresh Patel',
      vehicle: 'Maruti Ciaz',
      pickup: 'Mall',
      destination: 'Restaurant',
      date: '2024-01-13',
      fare: 180,
      status: 'completed',
      rating: 4,
      driverRating: 4.7
    },
    {
      id: 'RH003',
      driver: 'Vikram Sharma',
      vehicle: 'Toyota Etios',
      pickup: 'Airport',
      destination: 'Hotel',
      date: '2024-01-12',
      fare: 420,
      status: 'cancelled',
      rating: null,
      driverRating: 4.6
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setDialogOpen(true);
  };

  const handleRateRide = (ride) => {
    setSelectedRide(ride);
    setRatingDialogOpen(true);
  };

  const handleSubmitRating = () => {
    // Submit rating logic
    setRatingDialogOpen(false);
    setRating(0);
    setFeedback('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'driver_assigned': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'driver_assigned': return 'Driver Assigned';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Rides
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Active (${activeRides.length})`} />
          <Tab label={`History (${rideHistory.length})`} />
        </Tabs>
      </Box>

      {/* Active Rides */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {activeRides.length > 0 ? (
            activeRides.map((ride) => (
              <Grid item xs={12} key={ride.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Ride to {ride.destination.split(',')[0]}
                        </Typography>
                        <Chip 
                          label={getStatusText(ride.status)} 
                          color={getStatusColor(ride.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="h6" color="primary">
                        ₹{ride.fare}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Driver
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar><Person /></Avatar>
                            <Box>
                              <Typography variant="subtitle1">{ride.driver}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                                <Typography variant="body2">{ride.driverRating}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Vehicle
                          </Typography>
                          <Typography variant="body1">{ride.vehicle}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Route
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" color="success" />
                            <Typography variant="body2">{ride.pickup}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn fontSize="small" color="error" />
                            <Typography variant="body2">{ride.destination}</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            ETA
                          </Typography>
                          <Typography variant="body1">{ride.eta}</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Phone />}
                        size="small"
                      >
                        Call Driver
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Navigation />}
                        size="small"
                      >
                        Track Ride
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        size="small"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="text"
                        startIcon={<Refresh />}
                        size="small"
                        onClick={() => handleViewDetails(ride)}
                      >
                        Refresh
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <DirectionsCar sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Active Rides
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Book a ride to get started
                  </Typography>
                  <Button variant="contained" startIcon={<DirectionsCar />}>
                    Book a Ride
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Ride History */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <List>
              {rideHistory.map((ride, index) => (
                <React.Fragment key={ride.id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1">{ride.driver}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip 
                              label={getStatusText(ride.status)} 
                              color={getStatusColor(ride.status)}
                              size="small"
                            />
                            <Typography variant="subtitle1" color="primary">
                              ₹{ride.fare}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {ride.pickup} → {ride.destination}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {ride.date} • {ride.vehicle}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {ride.rating ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                                  <Typography variant="body2">{ride.rating}</Typography>
                                </Box>
                              ) : ride.status === 'completed' ? (
                                <Button
                                  size="small"
                                  startIcon={<Star />}
                                  onClick={() => handleRateRide(ride)}
                                >
                                  Rate
                                </Button>
                              ) : null}
                              <Button
                                size="small"
                                onClick={() => handleViewDetails(ride)}
                              >
                                Details
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < rideHistory.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Ride Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Ride Details
        </DialogTitle>
        <DialogContent>
          {selectedRide && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Trip Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Pickup</Typography>
                  <Typography variant="body1">{selectedRide.pickup}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Destination</Typography>
                  <Typography variant="body1">{selectedRide.destination}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body1">
                    {selectedRide.date || new Date(selectedRide.bookingTime).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Fare</Typography>
                  <Typography variant="body1">₹{selectedRide.fare}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Driver Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Driver</Typography>
                  <Typography variant="body1">{selectedRide.driver}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Vehicle</Typography>
                  <Typography variant="body1">{selectedRide.vehicle}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Driver Rating</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                    <Typography variant="body1">{selectedRide.driverRating}</Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={getStatusText(selectedRide.status)} 
                    color={getStatusColor(selectedRide.status)}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Ride</DialogTitle>
        <DialogContent>
          {selectedRide && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                How was your ride with {selectedRide.driver}?
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                sx={{ my: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Feedback (Optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitRating} variant="contained" disabled={rating === 0}>
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerRides;