import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  LocationOn,
  MyLocation,
  DirectionsCar,
  AttachMoney
} from '@mui/icons-material';
import axios from 'axios';

const BookRide = () => {
  const [formData, setFormData] = useState({
    pickup: {
      address: '',
      coordinates: [77.5946, 12.9716] // Default Bangalore coordinates
    },
    destination: {
      address: '',
      coordinates: [77.6413, 12.9141]
    },
    serviceType: 'bike-taxi',
    paymentMethod: 'online'
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const serviceTypes = [
    { value: 'bike-taxi', label: 'Bike Taxi', icon: '🏍️' },
    { value: 'courier', label: 'Courier', icon: '📦' },
    { value: 'auto', label: 'Auto Rickshaw', icon: '🛺' },
    { value: 'mini-truck', label: 'Mini Truck', icon: '🚚' },
    { value: 'truck', label: 'Truck', icon: '🚛' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setEstimate(null); // Clear estimate when inputs change
  };

  const handleAddressChange = (field, address) => {
    // In a real app, you'd use Google Places API to get coordinates
    const mockCoordinates = field === 'pickup' 
      ? [77.5946 + Math.random() * 0.1, 12.9716 + Math.random() * 0.1]
      : [77.6413 + Math.random() * 0.1, 12.9141 + Math.random() * 0.1];

    setFormData(prev => ({
      ...prev,
      [field]: {
        address,
        coordinates: mockCoordinates
      }
    }));
    setEstimate(null);
  };

  const getEstimate = async () => {
    if (!formData.pickup.address || !formData.destination.address) {
      setMessage({ type: 'error', text: 'Please enter both pickup and destination addresses' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/customers/estimate', {
        pickup: formData.pickup,
        destination: formData.destination,
        serviceType: formData.serviceType
      });

      if (response.data.success) {
        setEstimate(response.data.estimate);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to get estimate' 
      });
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async () => {
    if (!estimate) {
      setMessage({ type: 'error', text: 'Please get an estimate first' });
      return;
    }

    setBookingLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/rides/book', {
        pickup: formData.pickup,
        destination: formData.destination,
        serviceType: formData.serviceType,
        paymentMethod: formData.paymentMethod
      });

      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: `Ride booked successfully! Ride ID: ${response.data.ride.rideId}` 
        });
        // Reset form
        setFormData({
          pickup: { address: '', coordinates: [77.5946, 12.9716] },
          destination: { address: '', coordinates: [77.6413, 12.9141] },
          serviceType: 'bike-taxi',
          paymentMethod: 'online'
        });
        setEstimate(null);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to book ride' 
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
        Book a Ride
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter your pickup and destination to get started
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trip Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Pickup Location"
                    value={formData.pickup.address}
                    onChange={(e) => handleAddressChange('pickup', e.target.value)}
                    InputProps={{
                      startAdornment: <MyLocation sx={{ mr: 1, color: 'primary.main' }} />
                    }}
                    placeholder="Enter pickup address"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Destination"
                    value={formData.destination.address}
                    onChange={(e) => handleAddressChange('destination', e.target.value)}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'error.main' }} />
                    }}
                    placeholder="Enter destination address"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={formData.serviceType}
                      label="Service Type"
                      onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    >
                      {serviceTypes.map((service) => (
                        <MenuItem key={service.value} value={service.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{service.icon}</span>
                            {service.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={formData.paymentMethod}
                      label="Payment Method"
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    >
                      <MenuItem value="online">Online Payment</MenuItem>
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="wallet">Wallet</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={getEstimate}
                    disabled={loading || !formData.pickup.address || !formData.destination.address}
                    startIcon={loading ? <CircularProgress size={20} /> : <AttachMoney />}
                  >
                    {loading ? 'Getting Estimate...' : 'Get Fare Estimate'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ride Summary
              </Typography>

              {estimate ? (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Distance</Typography>
                    <Typography variant="h6">{estimate.distance} km</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Estimated Time</Typography>
                    <Typography variant="h6">{estimate.estimatedTime} mins</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Base Fare</Typography>
                      <Typography variant="body2">₹{estimate.fare.baseFare}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Distance Fare</Typography>
                      <Typography variant="body2">₹{estimate.fare.distanceFare}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Total Fare</Typography>
                    <Typography variant="h6" color="success.main">₹{estimate.fare.total}</Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={bookRide}
                    disabled={bookingLoading}
                    startIcon={bookingLoading ? <CircularProgress size={20} /> : <DirectionsCar />}
                  >
                    {bookingLoading ? 'Booking...' : 'Book Ride'}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Enter pickup and destination to see fare estimate
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected Service
                </Typography>
                <Chip 
                  label={serviceTypes.find(s => s.value === formData.serviceType)?.label}
                  color="primary"
                  icon={<DirectionsCar />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookRide;