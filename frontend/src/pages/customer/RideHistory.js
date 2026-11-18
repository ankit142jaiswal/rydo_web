import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Avatar,
  Rating,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  TwoWheeler,
  DirectionsCar,
  LocalShipping,
  Search,
  Star,
  Receipt,
  Repeat
} from '@mui/icons-material';

const rideHistory = [
  {
    id: 1,
    type: 'Bike Taxi',
    icon: TwoWheeler,
    from: 'Connaught Place',
    to: 'India Gate',
    date: '2024-01-15',
    time: '10:30 AM',
    fare: 85,
    status: 'completed',
    driver: 'Rajesh Kumar',
    rating: 4.5,
    distance: '8.2 km'
  },
  {
    id: 2,
    type: 'Auto/Car',
    icon: DirectionsCar,
    from: 'Karol Bagh',
    to: 'Lajpat Nagar',
    date: '2024-01-14',
    time: '2:15 PM',
    fare: 150,
    status: 'completed',
    driver: 'Amit Singh',
    rating: 5.0,
    distance: '12.5 km'
  },
  {
    id: 3,
    type: 'Courier',
    icon: LocalShipping,
    from: 'Dwarka',
    to: 'Gurgaon',
    date: '2024-01-13',
    time: '11:00 AM',
    fare: 120,
    status: 'completed',
    driver: 'Suresh Yadav',
    rating: 4.0,
    distance: '15.3 km'
  },
  {
    id: 4,
    type: 'Bike Taxi',
    icon: TwoWheeler,
    from: 'Rohini',
    to: 'Pitampura',
    date: '2024-01-12',
    time: '6:45 PM',
    fare: 65,
    status: 'cancelled',
    driver: null,
    rating: null,
    distance: '5.8 km'
  }
];

const RideHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);

  const filteredRides = rideHistory.filter(ride =>
    ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'ongoing': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Ride History
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search rides by location or service type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {filteredRides.map((ride) => {
          const IconComponent = ride.icon;
          return (
            <Grid item xs={12} key={ride.id}>
              <Card 
                elevation={2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => setSelectedRide(ride)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <IconComponent />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {ride.type}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {ride.date} • {ride.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={ride.status.toUpperCase()}
                      color={getStatusColor(ride.status)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {ride.from} → {ride.to}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Distance: {ride.distance}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      ₹{ride.fare}
                    </Typography>
                  </Box>

                  {ride.status === 'completed' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Driver: {ride.driver}
                        </Typography>
                        <Rating value={ride.rating} size="small" readOnly />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<Receipt />}>
                          Receipt
                        </Button>
                        <Button size="small" startIcon={<Repeat />}>
                          Book Again
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredRides.length === 0 && (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No rides found matching your search
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default RideHistory;