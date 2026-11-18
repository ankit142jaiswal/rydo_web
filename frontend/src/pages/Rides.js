import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await axios.get('/api/admin/rides');
      setRides(response.data.rides);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: 'warning',
      accepted: 'info',
      started: 'primary',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Rides Management
      </Typography>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ride ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Fare</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map((ride) => (
                <TableRow key={ride._id}>
                  <TableCell>{ride.rideId}</TableCell>
                  <TableCell>{ride.customer?.name || 'N/A'}</TableCell>
                  <TableCell>{ride.driver?.name || 'Unassigned'}</TableCell>
                  <TableCell>{ride.serviceType}</TableCell>
                  <TableCell>
                    <Chip
                      label={ride.status}
                      color={getStatusColor(ride.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>₹{ride.fare.total}</TableCell>
                  <TableCell>
                    {new Date(ride.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleViewDetails(ride)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ride Details</DialogTitle>
        <DialogContent>
          {selectedRide && (
            <Box>
              <Typography><strong>Ride ID:</strong> {selectedRide.rideId}</Typography>
              <Typography><strong>Customer:</strong> {selectedRide.customer?.name}</Typography>
              <Typography><strong>Driver:</strong> {selectedRide.driver?.name || 'Unassigned'}</Typography>
              <Typography><strong>Pickup:</strong> {selectedRide.pickup.address}</Typography>
              <Typography><strong>Destination:</strong> {selectedRide.destination.address}</Typography>
              <Typography><strong>Distance:</strong> {selectedRide.distance} km</Typography>
              <Typography><strong>Fare:</strong> ₹{selectedRide.fare.total}</Typography>
              <Typography><strong>Status:</strong> {selectedRide.status}</Typography>
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

export default Rides;