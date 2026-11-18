import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
} from '@mui/material';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    commissionRate: 0.2,
    minimumFare: 25,
    services: {
      'bike-taxi': { enabled: true, baseFare: 25, perKmRate: 8 },
      'courier': { enabled: true, baseFare: 20, perKmRate: 6 },
      'auto': { enabled: false, baseFare: 40, perKmRate: 12 },
      'mini-truck': { enabled: false, baseFare: 100, perKmRate: 20 },
      'truck': { enabled: false, baseFare: 200, perKmRate: 35 }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleServiceToggle = (serviceType) => {
    setSettings(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceType]: {
          ...prev.services[serviceType],
          enabled: !prev.services[serviceType].enabled
        }
      }
    }));
  };

  const handleServiceUpdate = (serviceType, field, value) => {
    setSettings(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceType]: {
          ...prev.services[serviceType],
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/admin/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            
            <TextField
              fullWidth
              label="Commission Rate (%)"
              type="number"
              value={settings.commissionRate * 100}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                commissionRate: parseFloat(e.target.value) / 100
              }))}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Minimum Fare (₹)"
              type="number"
              value={settings.minimumFare}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                minimumFare: parseFloat(e.target.value)
              }))}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Service Configuration
            </Typography>
            
            {Object.entries(settings.services).map(([serviceType, config]) => (
              <Box key={serviceType} sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.enabled}
                      onChange={() => handleServiceToggle(serviceType)}
                    />
                  }
                  label={serviceType.replace('-', ' ').toUpperCase()}
                />
                
                {config.enabled && (
                  <Box sx={{ ml: 4, mt: 1 }}>
                    <TextField
                      size="small"
                      label="Base Fare (₹)"
                      type="number"
                      value={config.baseFare}
                      onChange={(e) => handleServiceUpdate(serviceType, 'baseFare', e.target.value)}
                      sx={{ mr: 2, mb: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Per KM Rate (₹)"
                      type="number"
                      value={config.perKmRate}
                      onChange={(e) => handleServiceUpdate(serviceType, 'perKmRate', e.target.value)}
                    />
                  </Box>
                )}
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;