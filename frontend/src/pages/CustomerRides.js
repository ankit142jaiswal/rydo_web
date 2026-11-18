import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  DirectionsCar,
  LocationOn,
  AccessTime,
  AttachMoney,
  Star,
  Cancel
} from '@mui/icons-material';
import axios from 'axios';

const CustomerRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [ratingDialog, setRatingDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await axios.get('/api/customers/rides');
      if (response.data.success) {
        setRides(response.data.rides);
      }
    } catch (error) {
      setError('Failed to fetch rides');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: 'warning',
      accepted: 'info',
      arrived: 'primary',
      started: 'secondary',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (serviceType) => {
    return serviceType === 'courier' ? <LocalShipping /> : <DirectionsCar />;
  };

  const canCancelRide = (status) => {
    return ['requested', 'accepted', 'arrived'].includes(status);
  };

  const canRateRide = (ride) => {
    return ride.status === 'completed' && !ride.rating?.customerRating;
  };

  const handleCancelRide = async () => {
    if (!selectedRide || !cancelReason.trim()) return;

    try {
      const response = await axios.post(`/api/customers/cancel-ride/${selectedRide.rideId}`, {
        reason: cancelReason
      });

      if (response.data.success) {
        setSuccess('Ride cancelled successfully');
        setCancelDialog(false);
        setCancelReason('');
        fetchRides();
      }
    } catch (error) {
      setError('Failed to cancel ride');
    }
  };

  const handleRateRide = async () => {
    if (!selectedRide) return;

    try {
      const response = await axios.post(`/api/rides/${selectedRide.rideId}/rate`, {
        rating,
        feedback
      });

      if (response.data.success) {
        setSuccess('Rating submitted successfully');
        setRatingDialog(false);
        setRating(5);
        setFeedback('');
        fetchRides();
      }
    } catch (error) {
      setError('Failed to submit rating');
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        My Rides
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {rides.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <DirectionsCar sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No rides found
            </Typography>
            <Button variant="contained" href="/book" sx={{ mt: 2 }}>
              Book Your First Ride
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {rides.map((ride) => (
            <Grid item xs={12} key={ride._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: '#1976d2' }}>
                        {getStatusIcon(ride.serviceType)}
                      </Box>
                      <Box>
                        <Typography variant="h6">
                          {ride.serviceType.replace('-', ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Ride ID: {ride.rideId}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={ride.status.toUpperCase()} 
                      color={getStatusColor(ride.status)}
                      size="small"
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn color="primary" fontSize="small" />
                        <Typography variant="body2">
                          <strong>From:</strong> {ride.pickup.address}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn color="error" fontSize="small" />
                        <Typography variant="body2">
                          <strong>To:</strong> {ride.destination.address}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AttachMoney color="success" fontSize="small" />
                        <Typography variant="body2">
                          <strong>Fare:</strong> ₹{ride.fare.total}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime color="action" fontSize="small" />
                        <Typography variant="body2">
                          <strong>Date:</strong> {new Date(ride.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {ride.driver && (
                    <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Driver:</strong> {ride.driver.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Phone:</strong> {ride.driver.phone}
                      </Typography>
                      {ride.driver.driverDetails?.vehicleNumber && (
                        <Typography variant="body2">
                          <strong>Vehicle:</strong> {ride.driver.driverDetails.vehicleNumber}
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {canCancelRide(ride.status) && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => {
                          setSelectedRide(ride);
                          setCancelDialog(true);
                        }}
                      >
                        Cancel Ride
                      </Button>
                    )}
                    
                    {canRateRide(ride) && (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Star />}
                        onClick={() => {
                          setSelectedRide(ride);
                          setRatingDialog(true);
                        }}
                      >
                        Rate Ride
                      </Button>
                    )}

                    {ride.rating?.customerRating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">Your Rating:</Typography>
                        <Rating value={ride.rating.customerRating} size="small" readOnly />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Cancel Ride</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Why do you want to cancel this ride?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Enter cancellation reason..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Keep Ride</Button>
          <Button 
            onClick={handleCancelRide} 
            color="error" 
            variant="contained"
            disabled={!cancelReason.trim()}
          >
            Cancel Ride
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialog} onClose={() => setRatingDialog(false)}>
        <DialogTitle>Rate Your Ride</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            How was your experience?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your feedback (optional)..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialog(false)}>Cancel</Button>
          <Button onClick={handleRateRide} variant="contained">
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerRides;