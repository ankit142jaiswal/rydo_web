import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Remove,
  Payment,
  History,
  TrendingUp,
  TrendingDown,
  Redeem,
  LocalOffer
} from '@mui/icons-material';
import axios from 'axios';

const CustomerWallet = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchWalletData = async () => {
    try {
      const response = await axios.get('/api/customers/dashboard');
      if (response.data.success) {
        setWalletData({
          balance: response.data.dashboard.wallet,
          totalSpent: response.data.dashboard.month.spending,
          totalSaved: 850, // Mock data
          cashback: 125 // Mock data
        });
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/customers/wallet/transactions');
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const mockTransactions = [
    {
      id: 'T001',
      type: 'debit',
      amount: 280,
      description: 'Ride Payment - Airport to Home',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed'
    },
    {
      id: 'T002',
      type: 'credit',
      amount: 500,
      description: 'Wallet Top-up via UPI',
      date: '2024-01-14',
      time: '10:15',
      status: 'completed'
    },
    {
      id: 'T003',
      type: 'credit',
      amount: 50,
      description: 'Cashback - Weekend Bonus',
      date: '2024-01-13',
      time: '18:45',
      status: 'completed'
    },
    {
      id: 'T004',
      type: 'debit',
      amount: 420,
      description: 'Ride Payment - Mall to Restaurant',
      date: '2024-01-12',
      time: '20:30',
      status: 'completed'
    }
  ];

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using UPI apps'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks supported'
    }
  ];

  const offers = [
    {
      id: 'O001',
      title: 'First Ride Free',
      description: 'Get your first ride free up to ₹200',
      code: 'FIRST200',
      discount: '100%',
      validUntil: '2024-02-15'
    },
    {
      id: 'O002',
      title: 'Weekend Special',
      description: '20% off on weekend rides',
      code: 'WEEKEND20',
      discount: '20%',
      validUntil: '2024-01-31'
    },
    {
      id: 'O003',
      title: 'Cashback Offer',
      description: 'Get 10% cashback up to ₹100',
      code: 'CASHBACK10',
      discount: '10%',
      validUntil: '2024-02-28'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddMoney = () => {
    setDialogType('add');
    setDialogOpen(true);
  };

  const handleWithdraw = () => {
    setDialogType('withdraw');
    setDialogOpen(true);
  };

  const handleTransaction = async () => {
    if (!amount || (dialogType === 'add' && !paymentMethod)) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      if (dialogType === 'add') {
        const response = await axios.post('/api/customers/wallet/add', {
          amount: parseFloat(amount)
        });
        
        if (response.data.success) {
          setMessage({ type: 'success', text: 'Money added successfully!' });
          fetchWalletData(); // Refresh wallet data
        }
      } else {
        // Withdraw logic (if implemented)
        setMessage({ type: 'info', text: 'Withdraw feature coming soon!' });
      }
      
      setTimeout(() => {
        setDialogOpen(false);
        setAmount('');
        setPaymentMethod('');
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Transaction failed' 
      });
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const handleViewStatement = () => {
    // Navigate to detailed statement page
    console.log('View detailed statement');
  };

  const handleApplyOffer = (offerCode) => {
    setMessage({ type: 'success', text: `Offer ${offerCode} applied successfully!` });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? 'success.main' : 'error.main';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}
      
      <Typography variant="h4" gutterBottom>
        My Wallet
      </Typography>

      {/* Wallet Balance Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#1a1a2e' }}>
                  <AccountBalanceWallet />
                </Avatar>
                <Box>
                  <Typography variant="h5">₹{walletData?.balance || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wallet Balance
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#f57c00' }}>
                  <Payment />
                </Avatar>
                <Box>
                  <Typography variant="h5">₹{walletData?.totalSpent || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#388e3c' }}>
                  <Redeem />
                </Avatar>
                <Box>
                  <Typography variant="h5">₹{walletData?.totalSaved || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Saved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#9c27b0' }}>
                  <LocalOffer />
                </Avatar>
                <Box>
                  <Typography variant="h5">₹{walletData?.cashback || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cashback Earned
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddMoney}
            >
              Add Money
            </Button>
            <Button
              variant="outlined"
              startIcon={<Remove />}
              onClick={handleWithdraw}
            >
              Withdraw
            </Button>
            <Button
              variant="outlined"
              startIcon={<History />}
              onClick={handleViewStatement}
            >
              View Statement
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Transactions" />
          <Tab label="Offers & Coupons" />
        </Tabs>
      </Box>

      {/* Transactions Tab */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            
            <List>
              {transactions.length > 0 ? transactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getTransactionIcon(transaction.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {transaction.description}
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            color={getTransactionColor(transaction.type)}
                            fontWeight="bold"
                          >
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.date} at {transaction.time}
                          </Typography>
                          <Chip 
                            label={transaction.status} 
                            color="success" 
                            size="small"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < transactions.length - 1 && <Divider />}
                </React.Fragment>
              )) : mockTransactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getTransactionIcon(transaction.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {transaction.description}
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            color={getTransactionColor(transaction.type)}
                            fontWeight="bold"
                          >
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.date} at {transaction.time}
                          </Typography>
                          <Chip 
                            label={transaction.status} 
                            color="success" 
                            size="small"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < mockTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Offers Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {offers.map((offer) => (
            <Grid item xs={12} md={6} key={offer.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {offer.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {offer.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${offer.discount} OFF`} 
                      color="primary" 
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 2, 
                    borderRadius: 1, 
                    border: '1px dashed #ccc',
                    mb: 2
                  }}>
                    <Typography variant="h6" textAlign="center" fontFamily="monospace">
                      {offer.code}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Valid until {offer.validUntil}
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleApplyOffer(offer.code)}
                    >
                      Apply
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Money / Withdraw Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'add' ? 'Add Money to Wallet' : 'Withdraw Money'}
        </DialogTitle>
        <DialogContent>
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
              }}
              sx={{ mb: 3 }}
            />
            
            {dialogType === 'add' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Payment Method
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        border: paymentMethod === method.id ? '2px solid #FFC107' : '1px solid #e0e0e0',
                        '&:hover': { borderColor: '#1a1a2e' }
                      }}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h4">{method.icon}</Typography>
                          <Box>
                            <Typography variant="subtitle1">{method.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleTransaction} 
            variant="contained"
            disabled={!amount || (dialogType === 'add' && !paymentMethod) || processing}
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {processing ? 'Processing...' : (dialogType === 'add' ? 'Add Money' : 'Withdraw')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerWallet;

