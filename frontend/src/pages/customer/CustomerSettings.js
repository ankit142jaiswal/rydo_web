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
  Alert
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

const CustomerSettings = () => {
  const [settings, setSettings] = useState({
    // App Preferences
    notifications: true,
    locationSharing: true,
    soundAlerts: true,
    vibration: true,
    nightMode: false,
    language: 'en',
    
    // Ride Preferences
    autoBooking: false,
    preferredPayment: 'wallet',
    rideReminders: true,
    
    // Privacy & Security
    shareLocation: true,
    dataCollection: true,
    biometricAuth: false,
    
    // Communication
    promotionalEmails: false,
    smsAlerts: true,
    pushNotifications: true
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
                    secondary="Receive ride updates and offers"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
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
                    primary="Location Services"
                    secondary="Allow location access for better service"
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
                    secondary="Play sounds for notifications"
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
                    primary="Dark Mode"
                    secondary="Use dark theme"
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
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Auto Booking"
                    secondary="Automatically book rides based on schedule"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoBooking}
                        onChange={(e) => handleSettingChange('autoBooking', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Ride Reminders"
                    secondary="Get reminders for scheduled rides"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.rideReminders}
                        onChange={(e) => handleSettingChange('rideReminders', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Preferred Payment Method"
                    secondary="Default payment option"
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={settings.preferredPayment}
                      onChange={(e) => handleSettingChange('preferredPayment', e.target.value)}
                    >
                      <MenuItem value="wallet">Wallet</MenuItem>
                      <MenuItem value="upi">UPI</MenuItem>
                      <MenuItem value="card">Card</MenuItem>
                      <MenuItem value="cash">Cash</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
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

        {/* Communication Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Communication
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="SMS Alerts"
                    secondary="Receive ride confirmations via SMS"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsAlerts}
                        onChange={(e) => handleSettingChange('smsAlerts', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Promotional Emails"
                    secondary="Receive offers and promotions"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.promotionalEmails}
                        onChange={(e) => handleSettingChange('promotionalEmails', e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Vibration"
                    secondary="Vibrate for notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.vibration}
                        onChange={(e) => handleSettingChange('vibration', e.target.checked)}
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
                    onClick={() => openDialog('payment')}
                  >
                    Manage Payments
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
          {dialogType === 'payment' && 'Manage Payment Methods'}
          {dialogType === 'support' && 'Contact Support'}
          {dialogType === 'feedback' && 'Send Feedback'}
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
          
          {dialogType === 'payment' && (
            <Typography variant="body2">
              Manage your payment methods, add new cards, or update existing ones.
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerSettings;