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
  TextField,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Settings,
  Security,
  Notifications,
  Payment,
  LocationOn,
  DirectionsCar,
  People,
  Edit,
  Delete,
  Add,
  Save,
  Refresh
} from '@mui/icons-material';

const AdminSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoDispatch: true,
    realTimeTracking: true,
    pushNotifications: true,
    smsNotifications: true,
    emailNotifications: true,
    driverVerification: true,
    customerVerification: false,
    geoFencing: true,
    surgepricing: true
  });

  const [pricingSettings, setPricingSettings] = useState({
    baseFare: 50,
    perKmRate: 12,
    perMinuteRate: 2,
    surgeMultiplier: 1.5,
    cancellationFee: 25,
    waitingCharges: 1,
    nightSurgeStart: '22:00',
    nightSurgeEnd: '06:00',
    nightSurgeRate: 1.2
  });

  const [adminUsers] = useState([
    {
      id: 'A001',
      name: 'Super Admin',
      email: 'admin@rydo.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      permissions: ['all']
    },
    {
      id: 'A002',
      name: 'Operations Manager',
      email: 'ops@rydo.com',
      role: 'operations',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      permissions: ['rides', 'drivers', 'customers']
    },
    {
      id: 'A003',
      name: 'Support Manager',
      email: 'support@rydo.com',
      role: 'support',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z',
      permissions: ['customers', 'rides']
    }
  ]);

  const [serviceAreas] = useState([
    { id: 1, name: 'Delhi NCR', status: 'active', drivers: 45, coverage: '95%' },
    { id: 2, name: 'Mumbai', status: 'active', drivers: 38, coverage: '88%' },
    { id: 3, name: 'Bangalore', status: 'active', drivers: 32, coverage: '82%' },
    { id: 4, name: 'Chennai', status: 'coming_soon', drivers: 0, coverage: '0%' }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSystemSettingChange = (setting) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePricingChange = (field, value) => {
    setPricingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType('');
  };

  const saveSettings = () => {
    // Save settings logic
    console.log('Settings saved');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'coming_soon': return 'warning';
      default: return 'default';
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" gutterBottom>
        ⚙️ System Settings Dashboard
      </Typography>
      <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
        This is the Admin Settings page - configure system settings and preferences
      </Typography>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={saveSettings}
        >
          Save All Changes
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="General" icon={<Settings />} />
          <Tab label="Pricing" icon={<Payment />} />
          <Tab label="Service Areas" icon={<LocationOn />} />
          <Tab label="Admin Users" icon={<People />} />
          <Tab label="Security" icon={<Security />} />
        </Tabs>
      </Box>

      {/* General Settings Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Configuration
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText
                      primary="Maintenance Mode"
                      secondary="Temporarily disable the platform"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.maintenanceMode}
                          onChange={() => handleSystemSettingChange('maintenanceMode')}
                          color="warning"
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <DirectionsCar />
                    </ListItemIcon>
                    <ListItemText
                      primary="Auto Dispatch"
                      secondary="Automatically assign rides to drivers"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.autoDispatch}
                          onChange={() => handleSystemSettingChange('autoDispatch')}
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
                      primary="Real-time Tracking"
                      secondary="Enable live location tracking"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.realTimeTracking}
                          onChange={() => handleSystemSettingChange('realTimeTracking')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Payment />
                    </ListItemIcon>
                    <ListItemText
                      primary="Surge Pricing"
                      secondary="Enable dynamic pricing during peak hours"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.surgepricing}
                          onChange={() => handleSystemSettingChange('surgepricing')}
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
                  Notification Settings
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Send push notifications to mobile apps"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.pushNotifications}
                          onChange={() => handleSystemSettingChange('pushNotifications')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="SMS Notifications"
                      secondary="Send SMS alerts for important updates"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.smsNotifications}
                          onChange={() => handleSystemSettingChange('smsNotifications')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Send email updates and reports"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.emailNotifications}
                          onChange={() => handleSystemSettingChange('emailNotifications')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Pricing Settings Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Base Pricing
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Base Fare (₹)"
                      type="number"
                      value={pricingSettings.baseFare}
                      onChange={(e) => handlePricingChange('baseFare', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Per KM Rate (₹)"
                      type="number"
                      value={pricingSettings.perKmRate}
                      onChange={(e) => handlePricingChange('perKmRate', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Per Minute Rate (₹)"
                      type="number"
                      value={pricingSettings.perMinuteRate}
                      onChange={(e) => handlePricingChange('perMinuteRate', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cancellation Fee (₹)"
                      type="number"
                      value={pricingSettings.cancellationFee}
                      onChange={(e) => handlePricingChange('cancellationFee', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Surge Pricing
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Surge Multiplier"
                      type="number"
                      step="0.1"
                      value={pricingSettings.surgeMultiplier}
                      onChange={(e) => handlePricingChange('surgeMultiplier', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Night Surge Rate"
                      type="number"
                      step="0.1"
                      value={pricingSettings.nightSurgeRate}
                      onChange={(e) => handlePricingChange('nightSurgeRate', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Night Surge Start"
                      type="time"
                      value={pricingSettings.nightSurgeStart}
                      onChange={(e) => handlePricingChange('nightSurgeStart', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Night Surge End"
                      type="time"
                      value={pricingSettings.nightSurgeEnd}
                      onChange={(e) => handlePricingChange('nightSurgeEnd', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Service Areas Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Service Areas
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openDialog('addArea')}
              >
                Add New Area
              </Button>
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Area Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Active Drivers</TableCell>
                    <TableCell align="right">Coverage</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceAreas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell>{area.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={area.status.replace('_', ' ')} 
                          color={getStatusColor(area.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{area.drivers}</TableCell>
                      <TableCell align="right">{area.coverage}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Admin Users Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Admin Users
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openDialog('addUser')}
              >
                Add Admin User
              </Button>
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role.replace('_', ' ')} 
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status} 
                          color={getStatusColor(user.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Driver Verification Required"
                      secondary="Require document verification for drivers"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.driverVerification}
                          onChange={() => handleSystemSettingChange('driverVerification')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Customer Verification"
                      secondary="Require phone verification for customers"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.customerVerification}
                          onChange={() => handleSystemSettingChange('customerVerification')}
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Geo-fencing"
                      secondary="Restrict operations to defined areas"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.geoFencing}
                          onChange={() => handleSystemSettingChange('geoFencing')}
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
                  System Maintenance
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    fullWidth
                  >
                    Clear Cache
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    fullWidth
                  >
                    Restart Services
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                  >
                    Generate System Report
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                  >
                    Backup Database
                  </Button>
                </Box>

                <Alert severity="warning" sx={{ mt: 3 }}>
                  System maintenance operations may temporarily affect service availability.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'addArea' && 'Add New Service Area'}
          {dialogType === 'addUser' && 'Add Admin User'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'addArea' && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Area Name"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Coverage Radius (km)"
                type="number"
                margin="normal"
              />
            </Box>
          )}
          
          {dialogType === 'addUser' && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Role"
                select
                margin="normal"
              >
                <MenuItem value="operations">Operations Manager</MenuItem>
                <MenuItem value="support">Support Manager</MenuItem>
                <MenuItem value="analyst">Data Analyst</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained">
            {dialogType === 'addArea' ? 'Add Area' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;