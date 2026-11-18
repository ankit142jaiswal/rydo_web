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
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffc107',
      light: '#ffecb3',
      dark: '#ff8f00',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/*" element={
        user ? (
          <SocketProvider>
            {user.role === 'admin' ? (
              // Admin Dashboard
              <Routes>
                <Route path="/admin/*" element={
                  <Box sx={{ display: 'flex' }}>
                    <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    <Sidebar open={sidebarOpen} />
                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        p: 3,
                        mt: 8,
                        ml: sidebarOpen ? '280px' : '80px',
                        transition: 'margin-left 0.3s ease-in-out',
                        backgroundColor: '#f8fafc',
                        minHeight: 'calc(100vh - 64px)',
                      }}
                    >
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
                    </Box>
                  </Box>
                } />
                <Route path="/" element={<Navigate to="/admin" />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </Routes>
            ) : user.role === 'driver' ? (
              // Driver Dashboard
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
              // Customer Dashboard
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