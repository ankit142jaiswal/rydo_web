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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Person,
  DirectionsCar,
  Description,
  Settings,
  Edit,
  Camera,
  Verified,
  Warning,
  Star,
  Phone,
  Email,
  LocationOn,
  CalendarToday
} from '@mui/icons-material';

const DriverProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState('');

  const driverData = {
    id: 'DRV001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    address: 'Sector 15, Noida, Uttar Pradesh',
    joinDate: '2023-06-15',
    rating: 4.8,
    totalRides: 1256,
    profilePicture: null,
    status: 'active',
    verificationStatus: 'verified'
  };

  const vehicleData = {
    make: 'Maruti Suzuki',
    model: 'Swift Dzire',
    year: '2020',
    color: 'White',
    plateNumber: 'DL 01 AB 1234',
    fuelType: 'Petrol',
    seatingCapacity: 4,
    vehicleType: 'Sedan'
  };

  const documents = [
    {
      type: 'Driving License',
      status: 'verified',
      expiryDate: '2028-03-15',
      uploadDate: '2023-06-15'
    },
    {
      type: 'Vehicle Registration',
      status: 'verified',
      expiryDate: '2025-12-20',
      uploadDate: '2023-06-15'
    },
    {
      type: 'Insurance Certificate',
      status: 'verified',
      expiryDate: '2024-08-10',
      uploadDate: '2023-06-15'
    },
    {
      type: 'PUC Certificate',
      status: 'pending',
      expiryDate: '2024-02-28',
      uploadDate: '2024-01-10'
    }
  ];

  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    autoAcceptRides: false,
    soundAlerts: true,
    nightMode: false
  });

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

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getDocumentStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'pending': return 'Under Review';
      case 'rejected': return 'Rejected';
      default: return 'Not Uploaded';
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Driver Profile
      </Typography>

      {/* Profile Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={driverData.profilePicture}
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
                <Typography variant="h5">{driverData.name}</Typography>
                {driverData.verificationStatus === 'verified' && (
                  <Verified color="success" />
                )}
              </Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Driver ID: {driverData.id}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ color: '#FFD700' }} />
                  <Typography variant="body2">{driverData.rating}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {driverData.totalRides} rides completed
                </Typography>
                <Chip 
                  label={driverData.status} 
                  color="success" 
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(driverData.joinDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Personal Info" icon={<Person />} />
          <Tab label="Vehicle Details" icon={<DirectionsCar />} />
          <Tab label="Documents" icon={<Description />} />
          <Tab label="Settings" icon={<Settings />} />
        </Tabs>
      </Box>

      {/* Personal Information Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
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
                      value={driverData.name}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={driverData.email}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={driverData.phone}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Join Date"
                      value={new Date(driverData.joinDate).toLocaleDateString()}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={driverData.address}
                      multiline
                      rows={2}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Stats
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Overall Rating
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(driverData.rating / 5) * 100} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {driverData.rating}/5.0
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Completion Rate
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={96} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    color="success"
                  />
                  <Typography variant="body2" color="text.secondary">
                    96%
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Acceptance Rate
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={89} 
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    color="warning"
                  />
                  <Typography variant="body2" color="text.secondary">
                    89%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Vehicle Details Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Vehicle Information</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => handleEditClick('vehicle')}
              >
                Edit
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Make"
                  value={vehicleData.make}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Model"
                  value={vehicleData.model}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Year"
                  value={vehicleData.year}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Color"
                  value={vehicleData.color}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="License Plate"
                  value={vehicleData.plateNumber}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Fuel Type"
                  value={vehicleData.fuelType}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Vehicle Type"
                  value={vehicleData.vehicleType}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Seating Capacity"
                  value={vehicleData.seatingCapacity}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Documents Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Document Verification
            </Typography>
            
            <List>
              {documents.map((doc, index) => (
                <React.Fragment key={doc.type}>
                  <ListItem>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.type}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={getDocumentStatusText(doc.status)}
                        color={getDocumentStatusColor(doc.status)}
                        size="small"
                      />
                      <Button size="small" variant="outlined">
                        {doc.status === 'verified' ? 'View' : 'Upload'}
                      </Button>
                    </Box>
                  </ListItem>
                  {index < documents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            {documents.some(doc => doc.status === 'pending') && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Some documents are under review. You'll be notified once verification is complete.
              </Alert>
            )}
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
                  App Preferences
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive ride requests and updates"
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
                      primary="Location Sharing"
                      secondary="Share location with customers during rides"
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
                  
                  <ListItem>
                    <ListItemText
                      primary="Auto Accept Rides"
                      secondary="Automatically accept ride requests"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.autoAcceptRides}
                          onChange={() => handleSettingChange('autoAcceptRides')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Sound Alerts"
                      secondary="Play sound for new ride requests"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.soundAlerts}
                          onChange={() => handleSettingChange('soundAlerts')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Night Mode"
                      secondary="Use dark theme for better visibility"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.nightMode}
                          onChange={() => handleSettingChange('nightMode')}
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
                  Account Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="outlined" fullWidth>
                    Change Password
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Update Bank Details
                  </Button>
                  <Button variant="outlined" fullWidth>
                    Download Data
                  </Button>
                  <Button variant="outlined" color="warning" fullWidth>
                    Deactivate Account
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
        <DialogTitle>Edit {editField === 'personal' ? 'Personal Information' : 'Vehicle Details'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Contact support to update your information or upload new documents.
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

export default DriverProfile;