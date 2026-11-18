import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Link
} from '@mui/material';
import {
  Phone,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock
} from '@mui/icons-material';

const AuthModal = ({ open, onClose, onAuthSuccess }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [loginData, setLoginData] = useState({ phone: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    otp: ''
  });
  const [resetData, setResetData] = useState({ phone: '', otp: '', newPassword: '' });

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (loginData.phone === '9876543210' && loginData.password === 'password') {
        onAuthSuccess({ name: 'John Doe', phone: loginData.phone });
        onClose();
      } else {
        setError('Invalid phone number or password');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = async () => {
    if (!otpSent) {
      setLoading(true);
      // Simulate OTP sending
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
        setError('');
      }, 1000);
    } else {
      setLoading(true);
      // Simulate registration
      setTimeout(() => {
        if (registerData.otp === '1234') {
          onAuthSuccess({ name: registerData.name, phone: registerData.phone });
          onClose();
        } else {
          setError('Invalid OTP');
        }
        setLoading(false);
      }, 1000);
    }
  };

  const handleForgotPassword = async () => {
    if (!otpSent) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(true);
      setTimeout(() => {
        if (resetData.otp === '1234') {
          setForgotPassword(false);
          setOtpSent(false);
          setTabValue(0);
          setError('');
        } else {
          setError('Invalid OTP');
        }
        setLoading(false);
      }, 1000);
    }
  };

  const renderLogin = () => (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#333' }}>
        Welcome back!
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Login to continue your journey
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        placeholder="Enter mobile number"
        value={loginData.phone}
        onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone sx={{ color: '#FFA726' }} />
            </InputAdornment>
          )
        }}
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: '#FFA726'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFA726'
            }
          }
        }}
      />

      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        value={loginData.password}
        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: '#FFA726' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: '#FFA726'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFA726'
            }
          }
        }}
      />

      <Box sx={{ textAlign: 'right', mb: 4 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => setForgotPassword(true)}
          sx={{ color: '#FFA726', textDecoration: 'none', fontWeight: 500 }}
        >
          Forgot Password?
        </Link>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleLogin}
        disabled={loading || !loginData.phone || !loginData.password}
        sx={{ 
          mb: 3, 
          py: 1.8,
          bgcolor: '#FFA726',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#FF9800',
            boxShadow: 'none'
          }
        }}
      >
        {loading ? 'Signing in...' : 'Login'}
      </Button>

      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
        <Typography variant="caption" color="textSecondary">
          Demo: Phone: 9876543210, Password: password
        </Typography>
      </Box>
    </Box>
  );

  const renderRegister = () => (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#333' }}>
        {otpSent ? 'Verify your number' : 'Create account'}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        {otpSent ? 'Enter the OTP sent to your phone' : 'Join thousands of happy riders'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {!otpSent ? (
        <>
          <TextField
            fullWidth
            placeholder="Full name"
            value={registerData.name}
            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#FFA726' }} />
                </InputAdornment>
              )
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#FFA726' },
                '&.Mui-focused fieldset': { borderColor: '#FFA726' }
              }
            }}
          />

          <TextField
            fullWidth
            placeholder="Mobile number"
            value={registerData.phone}
            onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: '#FFA726' }} />
                </InputAdornment>
              )
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#FFA726' },
                '&.Mui-focused fieldset': { borderColor: '#FFA726' }
              }
            }}
          />

          <TextField
            fullWidth
            placeholder="Email address"
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#FFA726' }} />
                </InputAdornment>
              )
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#FFA726' },
                '&.Mui-focused fieldset': { borderColor: '#FFA726' }
              }
            }}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Create password"
            value={registerData.password}
            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#FFA726' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ 
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#FFA726' },
                '&.Mui-focused fieldset': { borderColor: '#FFA726' }
              }
            }}
          />
        </>
      ) : (
        <>
          <TextField
            fullWidth
            placeholder="Enter 4-digit OTP"
            value={registerData.otp}
            onChange={(e) => setRegisterData({...registerData, otp: e.target.value})}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                textAlign: 'center',
                fontSize: '1.2rem',
                letterSpacing: '0.5rem'
              }
            }}
          />
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body2" color="textSecondary">
              Didn't receive OTP? 
              <Link component="button" sx={{ color: '#FFA726', ml: 0.5 }}>
                Resend
              </Link>
            </Typography>
          </Box>
        </>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleRegister}
        disabled={loading}
        sx={{ 
          mb: 3, 
          py: 1.8,
          bgcolor: '#FFA726',
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#FF9800',
            boxShadow: 'none'
          }
        }}
      >
        {loading ? 'Processing...' : otpSent ? 'Verify & Continue' : 'Get OTP'}
      </Button>

      {otpSent && (
        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="caption" color="textSecondary">
            Demo OTP: 1234
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderForgotPassword = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        {otpSent ? 'Enter OTP and new password' : 'Enter your phone number'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!otpSent ? (
        <TextField
          fullWidth
          label="Phone Number"
          value={resetData.phone}
          onChange={(e) => setResetData({...resetData, phone: e.target.value})}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            )
          }}
          sx={{ mb: 3 }}
        />
      ) : (
        <>
          <TextField
            fullWidth
            label="Enter OTP"
            value={resetData.otp}
            onChange={(e) => setResetData({...resetData, otp: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            value={resetData.newPassword}
            onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />
        </>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleForgotPassword}
        disabled={loading}
        sx={{ mb: 2, py: 1.5 }}
      >
        {loading ? 'Processing...' : otpSent ? 'Reset Password' : 'Send OTP'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={() => {
          setForgotPassword(false);
          setOtpSent(false);
          setError('');
        }}
      >
        Back to Login
      </Button>

      {otpSent && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
          Demo OTP: 1234
        </Typography>
      )}
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {forgotPassword ? (
          renderForgotPassword()
        ) : (
          <>
            <Box sx={{ bgcolor: '#FFA726', p: 2, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="white">
                Welcome to RYDO
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                India's leading bike taxi platform
              </Typography>
            </Box>
            
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                },
                '& .Mui-selected': {
                  color: '#FFA726 !important'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFA726'
                }
              }}
            >
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
            <Divider />
            {tabValue === 0 ? renderLogin() : renderRegister()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;