import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const steps = ['Location', 'Vehicle', 'Payment'];

const BookingModal = ({ open, onClose, serviceType, user, onAuthRequired }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    pickup: '',
    destination: '',
    vehicleType: serviceType,
    paymentMethod: 'cash',
    phone: ''
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleBooking();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleBooking = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setTimeout(() => {
      alert('Booking confirmed! Driver will arrive in 5 minutes.');
      onClose();
      setActiveStep(0);
    }, 1000);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Pickup Location"
              value={bookingData.pickup}
              onChange={(e) => setBookingData({...bookingData, pickup: e.target.value})}
              sx={{ mb: 2 }}
              InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: 'primary.main' }} /> }}
            />
            <TextField
              fullWidth
              label="Destination"
              value={bookingData.destination}
              onChange={(e) => setBookingData({...bookingData, destination: e.target.value})}
              InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: 'secondary.main' }} /> }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Selected Service: {serviceType}</Typography>
            <TextField
              fullWidth
              label="Phone Number"
              value={bookingData.phone}
              onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
              sx={{ mt: 2 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <Grid container spacing={2}>
              {['cash', 'online', 'wallet'].map((method) => (
                <Grid item key={method}>
                  <Chip
                    label={method.toUpperCase()}
                    onClick={() => setBookingData({...bookingData, paymentMethod: method})}
                    color={bookingData.paymentMethod === method ? 'primary' : 'default'}
                    variant={bookingData.paymentMethod === method ? 'filled' : 'outlined'}
                  />
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ mt: 2 }}>
              Estimated fare: ₹{serviceType === 'Bike Taxi' ? '50' : serviceType === 'Auto/Car' ? '120' : '80'}
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book {serviceType}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
        <Button 
          variant="contained" 
          onClick={handleNext}
          disabled={!bookingData.pickup || !bookingData.destination}
        >
          {activeStep === steps.length - 1 ? (user ? 'Confirm Booking' : 'Login to Book') : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;