import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Container,
  Paper,
  Chip,
  Avatar,
  CardActions,
  Divider,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  DirectionsCar, 
  TwoWheeler, 
  LocalShipping,
  AccessTime,
  CurrencyRupee,
  Star,
  LocationOn,
  MyLocation,
  SwapVert
} from '@mui/icons-material';
import BookingModal from '../../components/booking/BookingModal';
import Header from '../../components/layout/Header';
import AuthModal from '../../components/auth/AuthModal';

const services = [
  {
    id: 1,
    title: 'Bike',
    subtitle: 'Affordable everyday commute',
    icon: TwoWheeler,
    price: '₹3/km',
    time: '2 mins away',
    color: '#FFA726',
    bgColor: '#FFF3E0',
    savings: 'Save up to 60%'
  },
  {
    id: 2,
    title: 'Auto',
    subtitle: 'Comfortable rides',
    icon: DirectionsCar,
    price: '₹12/km',
    time: '4 mins away',
    color: '#66BB6A',
    bgColor: '#E8F5E8',
    savings: 'No surge pricing'
  },
  {
    id: 3,
    title: 'Parcel',
    subtitle: 'Doorstep delivery',
    icon: LocalShipping,
    price: '₹25 onwards',
    time: '15 mins pickup',
    color: '#42A5F5',
    bgColor: '#E3F2FD',
    savings: 'Same day delivery'
  }
];

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleBookNow = (serviceTitle) => {
    setSelectedService(serviceTitle);
    setModalOpen(true);
  };

  const handleAuthRequired = () => {
    setModalOpen(false);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthModalOpen(false);
    setModalOpen(true);
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Header />
      
      {/* Main Booking Section */}
      <Container maxWidth="sm" sx={{ pt: 3, pb: 2 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            borderRadius: 3,
            bgcolor: 'white',
            mb: 3
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
            Book Your Ride
          </Typography>
          
          {/* Location Inputs */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Pickup location"
              variant="outlined"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#f8f9fa'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4CAF50' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <MyLocation sx={{ color: '#FFA726' }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              placeholder="Where to?"
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#f8f9fa'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336' }} />
                  </InputAdornment>
                )
              }}
            />
            
            {/* Swap Button */}
            <IconButton 
              sx={{ 
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                boxShadow: 1,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <SwapVert sx={{ color: '#666' }} />
            </IconButton>
          </Box>
        </Paper>
      </Container>

      {/* Service Options */}
      <Container maxWidth="sm" sx={{ pb: 4 }}>
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, px: 1, color: '#333' }}>
          Choose a ride
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Paper 
                key={service.id}
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'white',
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: service.color,
                    boxShadow: `0 4px 12px ${service.color}20`
                  }
                }}
                onClick={() => handleBookNow(service.title)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      bgcolor: service.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3
                    }}
                  >
                    <IconComponent sx={{ fontSize: 28, color: service.color }} />
                  </Box>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                        {service.title}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                        {service.price}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        {service.subtitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {service.time}
                      </Typography>
                    </Box>
                    
                    <Chip 
                      label={service.savings}
                      size="small"
                      sx={{ 
                        mt: 1,
                        bgcolor: service.bgColor,
                        color: service.color,
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Container>

      {/* Quick Actions */}
      <Container maxWidth="sm" sx={{ pb: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            borderRadius: 3,
            bgcolor: 'white'
          }}
        >
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#333' }}>
            Quick Actions
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ 
                  py: 2,
                  borderRadius: 2,
                  borderColor: '#e0e0e0',
                  color: '#333',
                  '&:hover': {
                    borderColor: '#FFA726',
                    bgcolor: '#FFF3E0'
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <AccessTime sx={{ mb: 1, color: '#FFA726' }} />
                  <Typography variant="body2" fontWeight="600">
                    Schedule Ride
                  </Typography>
                </Box>
              </Button>
            </Grid>
            
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ 
                  py: 2,
                  borderRadius: 2,
                  borderColor: '#e0e0e0',
                  color: '#333',
                  '&:hover': {
                    borderColor: '#FFA726',
                    bgcolor: '#FFF3E0'
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Star sx={{ mb: 1, color: '#FFA726' }} />
                  <Typography variant="body2" fontWeight="600">
                    Ride History
                  </Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <BookingModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceType={selectedService}
        user={user}
        onAuthRequired={handleAuthRequired}
      />
      
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </Box>
  );
};

export default Home;