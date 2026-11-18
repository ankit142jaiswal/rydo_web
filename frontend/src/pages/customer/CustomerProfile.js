import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider
} from '@mui/material';
import {
  Person,
  Edit,
  Camera,
  LocationOn,
  Phone,
  Email,
  Notifications,
  Security,
  Payment,
  Help,
  Star,
  Verified
} from '@mui/icons-material';

const CustomerProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState('');

  const customerData = {
    id: 'CUST001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
    address: 'Sector 18, Noida, Uttar Pradesh',
    joinDate: '2023-08-15',
    rating: 4.6,
    totalRides: 45,
    profilePicture: null,
    status: 'active',
    verificationStatus: 'verified'
  };

  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    promotionalEmails: false,
    smsAlerts: true,
    rideReminders: true
  });

  const savedAddresses = [
    { id: 'home', label: 'Home', address: 'Sector 18, Noida, UP', icon: '🏠' },
    { id: 'work', label: 'Work', address: 'Cyber City, Gurgaon, HR', icon: '🏢' },
    { id: 'gym', label: 'Gym', address: 'Central Mall, Delhi', icon: '💪' }
  ];

  const paymentMethods = [
    { id: 'wallet', type: 'Wallet', details: 'RYDO Wallet', default: true },
    { id: 'upi', type: 'UPI', details: 'john@paytm', default: false },
    { id: 'card', type: 'Card', details: '**** **** **** 1234', default: false }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = (field) => {
    setEditField(field);
    setEditDialogOpen(true);
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {/* Profile Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={customerData.profilePicture}
                >
                  <Person sx={{ fontSize: 50 }} />
                </Avatar>
                <Button
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    minWidth: 'auto',
                    borderRadius: '50%',
                    p: 1
                  }}
                >
                  <Camera />
                </Button>
              </Box>
            </Grid>
            <Grid item xs>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h5">{customerData.name}</Typography>
                {customerData.verificationStatus === 'verified' && (
                  <Verified color="success" />
                )}
              </Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Customer ID: {customerData.id}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ color: '#FFD700' }} />
                  <Typography variant="body2">{customerData.rating}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {customerData.totalRides} rides completed
                </Typography>
                <Chip 
                  label={customerData.status} 
                  color="success" 
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(customerData.joinDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Personal Info" icon={<Person />} />
          <Tab label="Addresses" icon={<LocationOn />} />
          <Tab label="Payment Methods" icon={<Payment />} />
          <Tab label="Settings" icon={<Notifications />} />
        </Tabs>
      </Box>

      {/* Personal Information Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Personal Information</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => handleEditClick('personal')}
              >
                Edit
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={customerData.name}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={customerData.email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={customerData.phone}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Join Date"
                  value={new Date(customerData.joinDate).toLocaleDateString()}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={customerData.address}
                  multiline
                  rows={2}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Saved Addresses Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Saved Addresses</Typography>
              <Button variant="outlined" startIcon={<LocationOn />}>
                Add Address
              </Button>
            </Box>
            
            <List>
              {savedAddresses.map((address, index) => (
                <React.Fragment key={address.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Typography variant="h4">{address.icon}</Typography>
                    </ListItemIcon>
                    <ListItemText
                      primary={address.label}
                      secondary={address.address}
                    />
                    <Button size="small" startIcon={<Edit />}>
                      Edit
                    </Button>
                  </ListItem>
                  {index < savedAddresses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Payment Methods Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Payment Methods</Typography>
              <Button variant="outlined" startIcon={<Payment />}>
                Add Method
              </Button>
            </Box>
            
            <List>
              {paymentMethods.map((method, index) => (
                <React.Fragment key={method.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Payment />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">{method.type}</Typography>
                          {method.default && (
                            <Chip label="Default" color="primary" size="small" />
                          )}
                        </Box>
                      }
                      secondary={method.details}
                    />
                    <Button size="small" startIcon={<Edit />}>
                      Edit
                    </Button>
                  </ListItem>
                  {index < paymentMethods.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive ride updates and offers"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications}
                          onChange={() => handleSettingChange('notifications')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="SMS Alerts"
                      secondary="Get ride confirmations via SMS"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.smsAlerts}
                          onChange={() => handleSettingChange('smsAlerts')}
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
                          onChange={() => handleSettingChange('promotionalEmails')}
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
                          onChange={() => handleSettingChange('rideReminders')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Privacy & Security
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Location Sharing"
                      secondary="Share location during rides"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.locationSharing}
                          onChange={() => handleSettingChange('locationSharing')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                </List>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                  <Button variant="outlined" fullWidth>
                    Change Password
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Download My Data
                  </Button>
                  <Button variant="outlined" color="error" fullWidth>
                    Delete Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit {editField === 'personal' ? 'Personal Information' : 'Information'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Contact support to update your personal information or verify your account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Contact Support</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerProfile;