import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DriverLayout from './components/layout/DriverLayout';
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import RideManagement from './pages/admin/RideManagement';
import DriverManagement from './pages/admin/DriverManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import Analytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminProfile from './pages/admin/AdminProfile';
import Login from './pages/Login';
import Register from './pages/Register';

// Driver Components
import DriverDashboard from './pages/driver/DriverDashboard';
import ActiveRides from './pages/driver/ActiveRides';
import Earnings from './pages/driver/Earnings';
import RideHistory from './pages/driver/RideHistory';
import DriverProfile from './pages/driver/DriverProfile';
import DriverNotifications from './pages/driver/DriverNotifications';
import DriverSettings from './pages/driver/DriverSettings';

// Customer Components
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookRide from './pages/customer/BookRide';
import CustomerRides from './pages/customer/CustomerRides';
import CustomerWallet from './pages/customer/CustomerWallet';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerNotifications from './pages/customer/CustomerNotifications';
import CustomerSettings from './pages/customer/CustomerSettings';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#FF8F00',
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#1a1a2e',
      light: '#16213e',
      dark: '#0f0f1a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#64748b',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#FF8F00',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1.0625rem' },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500, color: '#64748b' },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
    button: { fontWeight: 600, letterSpacing: 0 },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: 3,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
          border: '1px solid #f1f5f9',
          borderRadius: 16,
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px 0 rgb(0 0 0 / 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          letterSpacing: 0,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
          color: '#1a1a1a',
          '&:hover': {
            background: 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: '#ffffff',
        },
        outlinedPrimary: {
          borderColor: '#FFC107',
          color: '#FF8F00',
          '&:hover': {
            borderColor: '#FF8F00',
            backgroundColor: '#fff8e1',
          },
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
        },
        sizeMedium: {
          padding: '8px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#FFC107' },
            '&.Mui-focused fieldset': {
              borderColor: '#FFC107',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& fieldset': { borderColor: '#e2e8f0' },
          '&:hover fieldset': { borderColor: '#FFC107' },
          '&.Mui-focused fieldset': {
            borderColor: '#FFC107',
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          width: 'calc(100% - 16px)',
          '&.Mui-selected': {
            backgroundColor: '#fff8e1',
            color: '#FF8F00',
            '&:hover': { backgroundColor: '#fff3cd' },
            '& .MuiListItemIcon-root': { color: '#FF8F00' },
          },
          '&:hover': { backgroundColor: '#f8fafc' },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #f1f5f9',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc',
          color: '#475569',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
          backgroundColor: '#1a1a2e',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#f1f5f9' },
      },
    },
  },
});

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <img
            src="/rydo_logo.png"
            alt="Rydo"
            style={{ width: 64, height: 64, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 12, padding: 8, marginBottom: 16 }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/*" element={
        user ? (
          <SocketProvider>
            {user.role === 'admin' ? (
              <Routes>
                <Route path="/admin/*" element={
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="rides" element={<RideManagement />} />
                      <Route path="drivers" element={<DriverManagement />} />
                      <Route path="customers" element={<CustomerManagement />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="notifications" element={<AdminNotifications />} />
                      <Route path="profile" element={<AdminProfile />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                  </AdminLayout>
                } />
                <Route path="/" element={<Navigate to="/admin" />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </Routes>
            ) : user.role === 'driver' ? (
              <Routes>
                <Route path="/driver/*" element={
                  <DriverLayout>
                    <Routes>
                      <Route index element={<DriverDashboard />} />
                      <Route path="rides" element={<ActiveRides />} />
                      <Route path="earnings" element={<Earnings />} />
                      <Route path="history" element={<RideHistory />} />
                      <Route path="profile" element={<DriverProfile />} />
                      <Route path="notifications" element={<DriverNotifications />} />
                      <Route path="settings" element={<DriverSettings />} />
                    </Routes>
                  </DriverLayout>
                } />
                <Route path="/" element={<Navigate to="/driver" />} />
                <Route path="*" element={<Navigate to="/driver" />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/customer/*" element={
                  <CustomerLayout>
                    <Routes>
                      <Route index element={<CustomerDashboard />} />
                      <Route path="book" element={<BookRide />} />
                      <Route path="rides" element={<CustomerRides />} />
                      <Route path="wallet" element={<CustomerWallet />} />
                      <Route path="profile" element={<CustomerProfile />} />
                      <Route path="notifications" element={<CustomerNotifications />} />
                      <Route path="settings" element={<CustomerSettings />} />
                    </Routes>
                  </CustomerLayout>
                } />
                <Route path="/" element={<Navigate to="/customer" />} />
                <Route path="*" element={<Navigate to="/customer" />} />
              </Routes>
            )}
          </SocketProvider>
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
