import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  AdminPanelSettings,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import axios from 'axios';

const AdminProfile = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    role: 'admin',
    createdAt: '',
    notifications: true,
    twoFactorAuth: false
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/admin/profile');
      if (response.data.success) {
        setProfile({
          ...response.data.profile,
          notifications: true,
          twoFactorAuth: false
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to load profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put('/api/admin/profile', {
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        department: profile.department
      });
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditing(false);
        setProfile(prev => ({ ...prev, ...response.data.profile }));
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchProfile(); // Reset to original data
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'error.main' }}>
            <AdminPanelSettings sx={{ fontSize: 40 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {profile.name || 'Admin User'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              RYDO Administrator
            </Typography>
            <Chip label={`Role: ${profile.role}`} size="small" sx={{ mt: 1 }} />
          </Box>
          <Button
            variant={editing ? "outlined" : "contained"}
            startIcon={editing ? <Cancel /> : <Edit />}
            onClick={editing ? handleCancel : () => setEditing(true)}
            disabled={saving}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={profile.name || ''}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              disabled={!editing}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
              }}
              sx={{ mb: 3 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={profile.phone || ''}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!editing}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
              }}
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={profile.email || ''}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled={!editing}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
              }}
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Department"
              value={profile.department || ''}
              onChange={(e) => setProfile({...profile, department: e.target.value})}
              disabled={!editing}
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Role"
              value={profile.role || 'admin'}
              disabled
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Join Date"
              value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
              disabled
              sx={{ mb: 3 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Security Settings
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={profile.notifications}
                onChange={(e) => setProfile({...profile, notifications: e.target.checked})}
                disabled={!editing}
              />
            }
            label="Admin Notifications"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={profile.twoFactorAuth}
                onChange={(e) => setProfile({...profile, twoFactorAuth: e.target.checked})}
                disabled={!editing}
              />
            }
            label="Two-Factor Authentication"
          />
        </Box>

        {editing && (
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSave}
              disabled={saving}
              sx={{ flexGrow: 1 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AdminProfile;