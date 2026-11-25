import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@rydo.com', password: 'admin123' },
      driver: { email: 'driver@rydo.com', password: 'driver123' },
      customer: { email: 'customer@rydo.com', password: 'customer123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#f5f6fa',
      }}
    >
      <Grid container sx={{ minHeight: '100vh', flex: 1 }}>
        {/* ── Left brand panel (hidden on mobile) ── */}
        <Grid
          item
          xs={false}
          md={5}
          lg={6}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            px: 6,
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: 'absolute',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,193,7,0.15) 0%, transparent 70%)',
              top: -80,
              right: -80,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,193,7,0.1) 0%, transparent 70%)',
              bottom: -60,
              left: -60,
            }}
          />
          {/* Floating card accent */}
          <Box
            sx={{
              position: 'absolute',
              top: 40,
              left: 40,
              width: 80,
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #FFC107, #FF8F00)',
            }}
          />

          {/* Brand content */}
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
                p: 1.5,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <img
                src="/rydo_logo.png"
                alt="Rydo"
                style={{
                  width: 40,
                  height: 40,
                  objectFit: 'contain',
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  padding: 4,
                }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#ffffff',
                mb: 1,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Welcome to{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #FFC107, #FF8F00)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Rydo
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 400,
                mb: 5,
                lineHeight: 1.6,
              }}
            >
              Your smart ride management platform for seamless travel experiences.
            </Typography>

            {/* Feature pills */}
            {[
              '🚗  Real-time ride tracking',
              '💳  Secure wallet payments',
              '📊  Advanced analytics',
            ].map((feature) => (
              <Box
                key={feature}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}
                >
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Bottom tagline */}
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: 32,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            © 2025 Rydo — All rights reserved
          </Typography>
        </Grid>

        {/* ── Right form panel ── */}
        <Grid
          item
          xs={12}
          md={7}
          lg={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, sm: 6, md: 8 },
            py: 6,
            bgcolor: '#ffffff',
          }}
        >
          {/* Mobile logo — only visible on small screens */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1.5,
              mb: 4,
            }}
          >
            <img
              src="/rydo_logo.png"
              alt="Rydo"
              style={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                backgroundColor: '#fff',
                borderRadius: 8,
                padding: 4,
              }}
            />
            <Typography variant="h5" fontWeight={800} sx={{ color: '#FFC107' }}>
              Rydo
            </Typography>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 420 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 0.75, color: '#1a1a2e' }}
            >
              Sign in
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
              Enter your credentials to access your dashboard.
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2.5 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: '#94a3b8' }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={!loading && <ArrowForward />}
                sx={{
                  mb: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: '10px',
                  background: loading
                    ? undefined
                    : 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
                  color: '#1a1a1a',
                  fontWeight: 700,
                }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Don't have an account?{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate('/register')}
                    underline="hover"
                    sx={{ color: '#FF8F00', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Create account
                  </Link>
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', px: 1 }}>
                  Quick demo access
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                {['admin', 'driver', 'customer'].map((role) => (
                  <Chip
                    key={role}
                    label={role.charAt(0).toUpperCase() + role.slice(1)}
                    variant="outlined"
                    clickable
                    onClick={() => fillDemo(role)}
                    sx={{
                      flex: 1,
                      borderColor: '#e2e8f0',
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      height: 36,
                      '&:hover': {
                        borderColor: '#FFC107',
                        color: '#FF8F00',
                        backgroundColor: '#fff8e1',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
