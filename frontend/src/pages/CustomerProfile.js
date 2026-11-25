import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Alert,
  Divider
} from '@mui/material';
import { Person, Phone, Email, Edit, Save, Cancel } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CustomerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put('/api/auth/profile', formData);
      if (response.data.success) {
        setSuccess('Profile updated successfully');
        setEditing(false);
        if (updateProfile) {
          updateProfile(response.data.user);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setEditing(false);
    setError('');
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        My Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: '#1a1a2e' }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Customer Account
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: '#666' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: '#666' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: '#666' }} />
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                {!editing ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Account Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Account Type
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Customer
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Wallet Balance
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a2e' }}>
                  ₹{user?.wallet || 0}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Member Since
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerProfile;
