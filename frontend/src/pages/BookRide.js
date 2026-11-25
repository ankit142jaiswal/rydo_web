import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  LocationOn,
  MyLocation,
  DirectionsCar,
  LocalShipping,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '../utils/razorpay';
import axios from 'axios';

const BookRide = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    pickup: { address: '', coordinates: [0, 0] },
    destination: { address: '', coordinates: [0, 0] },
    serviceType: 'bike-taxi',
    paymentMethod: 'cash',
    specialInstructions: ''
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const services = [
    { id: 'bike-taxi', name: 'Bike Taxi', icon: <DirectionsCar />, color: '#1a1a2e', available: true },
    { id: 'courier', name: 'Courier', icon: <LocalShipping />, color: '#4caf50', available: true },
    { id: 'auto', name: 'Auto', icon: <DirectionsCar />, color: '#ff9800', available: false },
    { id: 'mini-truck', name: 'Mini Truck', icon: <LocalShipping />, color: '#9c27b0', available: false }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : { ...prev[field], ...value }
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          handleInputChange('pickup', {
            address: 'Current Location',
            coordinates: coords
          });
        },
        (error) => {
          setError('Unable to get current location');
        }
      );
    }
  };

  const getEstimate = async () => {
    if (!formData.pickup.address || !formData.destination.address) {
      setError('Please enter both pickup and destination');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/customers/estimate', {
        pickup: formData.pickup,
        destination: formData.destination,
        serviceType: formData.serviceType
      });

      if (response.data.success) {
        setEstimate(response.data.estimate);
        setError('');
      }
    } catch (error) {
      setError('Failed to get estimate');
    }
    setLoading(false);
  };

  const bookRide = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/rides/book', formData);
      
      if (response.data.success) {
        const rideData = response.data.ride;
        
        // Handle payment based on method
        if (formData.paymentMethod === 'online') {
          // Create Razorpay order
          const orderResponse = await axios.post('/api/payments/create-order', {
            rideId: rideData.rideId,
            amount: estimate.fare.total
          });
          
          if (orderResponse.data.success) {
            // Initiate Razorpay payment
            initiatePayment(
              {
                ...orderResponse.data.order,
                customerName: user.name,
                customerEmail: user.email,
                customerPhone: user.phone
              },
              async (paymentResponse) => {
                // Verify payment
                try {
                  await axios.post('/api/payments/verify-payment', {
                    ...paymentResponse,
                    rideId: rideData.rideId
                  });
                  setSuccess('Payment successful! Ride booked.');
                  setTimeout(() => window.location.href = '/rides', 2000);
                } catch (error) {
                  setError('Payment verification failed');
                }
              },
              (error) => {
                setError(`Payment failed: ${error}`);
              }
            );
          }
        } else if (formData.paymentMethod === 'wallet') {
          // Pay from wallet
          try {
            await axios.post('/api/payments/pay-from-wallet', {
              rideId: rideData.rideId,
              amount: estimate.fare.total
            });
            setSuccess('Payment from wallet successful! Ride booked.');
            setTimeout(() => window.location.href = '/rides', 2000);
          } catch (error) {
            setError(error.response?.data?.message || 'Wallet payment failed');
          }
        } else {
          // Cash payment
          setSuccess('Ride booked successfully! Pay cash to driver.');
          setTimeout(() => window.location.href = '/rides', 2000);
        }
        
        setConfirmDialog(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book ride');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        Book Your Ride
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Booking Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {/* Service Selection */}
            <Typography variant="h6" sx={{ mb: 2 }}>Select Service</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {services.map((service) => (
                <Grid item xs={6} sm={3} key={service.id}>
                  <Card 
                    sx={{ 
                      cursor: service.available ? 'pointer' : 'not-allowed',
                      opacity: service.available ? 1 : 0.5,
                      border: formData.serviceType === service.id ? `2px solid ${service.color}` : '1px solid #e0e0e0'
                    }}
                    onClick={() => service.available && handleInputChange('serviceType', service.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ color: service.color, mb: 1 }}>
                        {service.icon}
                      </Box>
                      <Typography variant="body2">{service.name}</Typography>
                      {!service.available && <Chip label="Soon" size="small" />}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Location Inputs */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label="Pickup Location"
                    value={formData.pickup.address}
                    onChange={(e) => handleInputChange('pickup', { address: e.target.value })}
                    InputProps={{
                      startAdornment: <LocationOn color="primary" sx={{ mr: 1 }} />
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={getCurrentLocation}
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <MyLocation />
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Destination"
                  value={formData.destination.address}
                  onChange={(e) => handleInputChange('destination', { address: e.target.value })}
                  InputProps={{
                    startAdornment: <LocationOn color="error" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>
            </Grid>

            {/* Payment Method */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                label="Payment Method"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="online">Online Payment</MenuItem>
                <MenuItem value="wallet">Wallet (₹{user?.wallet || 0})</MenuItem>
              </Select>
            </FormControl>

            {/* Special Instructions */}
            <TextField
              fullWidth
              label="Special Instructions (Optional)"
              multiline
              rows={2}
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={getEstimate}
                disabled={loading}
                sx={{ flex: 1 }}
              >
                Get Estimate
              </Button>
              <Button
                variant="contained"
                onClick={() => setConfirmDialog(true)}
                disabled={loading || !estimate}
                sx={{ flex: 1 }}
              >
                Book Ride
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Estimate Card */}
        <Grid item xs={12} md={4}>
          {estimate && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1 }} />
                Fare Estimate
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Distance</Typography>
                <Typography variant="h6">{estimate.distance} km</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Estimated Time</Typography>
                <Typography variant="h6">{estimate.estimatedTime} mins</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Base Fare</Typography>
                <Typography variant="body1">₹{estimate.fare.baseFare}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Distance Fare</Typography>
                <Typography variant="body1">₹{estimate.fare.distanceFare}</Typography>
              </Box>
              
              <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
                <Typography variant="h5" color="primary">
                  Total: ₹{estimate.fare.total}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Service:</strong> {services.find(s => s.id === formData.serviceType)?.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>From:</strong> {formData.pickup.address}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>To:</strong> {formData.destination.address}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Payment:</strong> {formData.paymentMethod}
          </Typography>
          {estimate && (
            <Typography variant="h6" color="primary">
              <strong>Total Fare: ₹{estimate.fare.total}</strong>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={bookRide} variant="contained" disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookRide;
