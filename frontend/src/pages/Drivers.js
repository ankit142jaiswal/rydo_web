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
  Switch,
} from '@mui/material';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/api/admin/users?role=driver');
      setDrivers(response.data.users);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleStatusToggle = async (driverId, isActive) => {
    try {
      await axios.put(`/api/admin/users/${driverId}/status`, { isActive });
      fetchDrivers();
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  const handleVerifyDriver = async (driverId, isVerified) => {
    try {
      await axios.put(`/api/admin/drivers/${driverId}/verify`, { isVerified });
      fetchDrivers();
    } catch (error) {
      console.error('Error verifying driver:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Drivers Management
      </Typography>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Vehicle Type</TableCell>
                <TableCell>Vehicle Number</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Total Rides</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.driverDetails?.vehicleType || 'N/A'}</TableCell>
                  <TableCell>{driver.driverDetails?.vehicleNumber || 'N/A'}</TableCell>
                  <TableCell>{driver.driverDetails?.rating || 5.0}</TableCell>
                  <TableCell>{driver.driverDetails?.totalRides || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={driver.isActive ? 'Active' : 'Inactive'}
                      color={driver.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={driver.isVerified ? 'Verified' : 'Pending'}
                      color={driver.isVerified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={driver.isActive}
                      onChange={(e) => handleStatusToggle(driver._id, e.target.checked)}
                      size="small"
                    />
                    <Button
                      size="small"
                      onClick={() => handleVerifyDriver(driver._id, !driver.isVerified)}
                      sx={{ ml: 1 }}
                    >
                      {driver.isVerified ? 'Unverify' : 'Verify'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Drivers;