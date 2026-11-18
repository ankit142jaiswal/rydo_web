import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  Chip
} from '@mui/material';
import {
  Notifications,
  LocationOn,
  VolumeUp,
  Brightness6,
  Language,
  Security,
  Payment,
  Help,
  Feedback,
  Info,
  Logout,
  Delete,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';

const DriverSettings = () => {
  const [settings, setSettings] = useState({
    // App Preferences
    notifications: true,
    locationSharing: true,
    autoAcceptRides: false,
    soundAlerts: true,
    vibration: true,
    nightMode: false,
    language: 'en',
    
    // Ride Preferences
    maxDistance: 15,
    preferredAreas: ['Noida', 'Gurgaon'],
    rideTypes: ['economy', 'premium'],
    
    // Privacy & Security
    shareLocation: true,
    dataCollection: true,
    biometricAuth: false,
    
    // Sound & Display
    alertVolume: 80,
    screenBrightness: 70,
    mapStyle: 'standard'
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [tempValue, setTempValue] = useState('');

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType('');
    setTempValue('');
  };

  const saveSettings = () => {
    // Save settings logic
    console.log('Settings saved:', settings);
  };

  const resetSettings = () => {
    // Reset to default settings
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={resetSettings}
          >
            Reset to Default
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveSettings}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* App Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                App Preferences
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive ride requests and updates"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location Sharing"
                    secondary="Share location with customers during rides"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.locationSharing}
                        onChange={(e) => handleSettingChange('locationSharing', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <VolumeUp />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sound Alerts"
                    secondary="Play sound for new ride requests"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.soundAlerts}
                        onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Brightness6 />
                  </ListItemIcon>
                  <ListItemText
                    primary="Night Mode"
                    secondary="Use dark theme for better visibility"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.nightMode}
                        onChange={(e) => handleSettingChange('nightMode', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  <ListItemText
                    primary="Language"
                    secondary="App display language"
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                      <MenuItem value="bn">Bengali</MenuItem>
                      <MenuItem value="ta">Tamil</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Ride Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ride Preferences
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Auto Accept Rides
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoAcceptRides}
                      onChange={(e) => handleSettingChange('autoAcceptRides', e.target.checked)}
                    />
                  }
                  label="Automatically accept ride requests"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Maximum Ride Distance: {settings.maxDistance} km
                </Typography>
                <Slider
                  value={settings.maxDistance}
                  onChange={(e, value) => handleSettingChange('maxDistance', value)}
                  min={5}
                  max={50}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Preferred Areas
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {settings.preferredAreas.map((area) => (
                    <Chip
                      key={area}
                      label={area}
                      onDelete={() => {
                        const newAreas = settings.preferredAreas.filter(a => a !== area);
                        handleSettingChange('preferredAreas', newAreas);
                      }}
                    />
                  ))}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => openDialog('areas')}
                  >
                    Add Area
                  </Button>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Ride Types
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['economy', 'premium', 'luxury'].map((type) => (
                    <Chip
                      key={type}
                      label={type.charAt(0).toUpperCase() + type.slice(1)}
                      color={settings.rideTypes.includes(type) ? 'primary' : 'default'}
                      onClick={() => {
                        const newTypes = settings.rideTypes.includes(type)
                          ? settings.rideTypes.filter(t => t !== type)
                          : [...settings.rideTypes, type];
                        handleSettingChange('rideTypes', newTypes);
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sound & Display */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sound & Display
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Alert Volume: {settings.alertVolume}%
                </Typography>
                <Slider
                  value={settings.alertVolume}
                  onChange={(e, value) => handleSettingChange('alertVolume', value)}
                  min={0}
                  max={100}
                  step={10}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Screen Brightness: {settings.screenBrightness}%
                </Typography>
                <Slider
                  value={settings.screenBrightness}
                  onChange={(e, value) => handleSettingChange('screenBrightness', value)}
                  min={20}
                  max={100}
                  step={10}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.vibration}
                      onChange={(e) => handleSettingChange('vibration', e.target.checked)}
                    />
                  }
                  label="Vibration for alerts"
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Map Style
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={settings.mapStyle}
                    onChange={(e) => handleSettingChange('mapStyle', e.target.value)}
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="satellite">Satellite</MenuItem>
                    <MenuItem value="terrain">Terrain</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy & Security */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Privacy & Security
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Biometric Authentication"
                    secondary="Use fingerprint or face unlock"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.biometricAuth}
                        onChange={(e) => handleSettingChange('biometricAuth', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Share Location Data"
                    secondary="Allow location sharing for better service"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.shareLocation}
                        onChange={(e) => handleSettingChange('shareLocation', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Info />
                  </ListItemIcon>
                  <ListItemText
                    primary="Data Collection"
                    secondary="Allow anonymous usage data collection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dataCollection}
                        onChange={(e) => handleSettingChange('dataCollection', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => openDialog('password')}
                  >
                    Change Password
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Payment />}
                    onClick={() => openDialog('bank')}
                  >
                    Update Bank Details
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Help />}
                    onClick={() => openDialog('support')}
                  >
                    Contact Support
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Feedback />}
                    onClick={() => openDialog('feedback')}
                  >
                    Send Feedback
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Alert severity="warning" sx={{ mb: 2 }}>
                Dangerous actions that cannot be undone
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
                    onClick={() => openDialog('deactivate')}
                  >
                    Deactivate Account
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => openDialog('delete')}
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Dialogs */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'password' && 'Change Password'}
          {dialogType === 'bank' && 'Update Bank Details'}
          {dialogType === 'support' && 'Contact Support'}
          {dialogType === 'feedback' && 'Send Feedback'}
          {dialogType === 'areas' && 'Add Preferred Area'}
          {dialogType === 'deactivate' && 'Deactivate Account'}
          {dialogType === 'delete' && 'Delete Account'}
        </DialogTitle>
        
        <DialogContent>
          {dialogType === 'password' && (
            <Box>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                margin="normal"
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                margin="normal"
              />
            </Box>
          )}
          
          {dialogType === 'bank' && (
            <Typography variant="body2">
              For security reasons, bank details can only be updated by contacting our support team.
            </Typography>
          )}
          
          {dialogType === 'support' && (
            <Box>
              <TextField
                fullWidth
                label="Subject"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                margin="normal"
              />
            </Box>
          )}
          
          {dialogType === 'feedback' && (
            <TextField
              fullWidth
              label="Your Feedback"
              multiline
              rows={4}
              margin="normal"
              placeholder="Tell us how we can improve..."
            />
          )}
          
          {dialogType === 'areas' && (
            <TextField
              fullWidth
              label="Area Name"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              margin="normal"
            />
          )}
          
          {(dialogType === 'deactivate' || dialogType === 'delete') && (
            <Alert severity="error">
              This action cannot be undone. Are you sure you want to proceed?
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color={dialogType === 'delete' ? 'error' : 'primary'}
          >
            {dialogType === 'areas' ? 'Add' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverSettings;