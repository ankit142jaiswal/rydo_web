import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  History,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '../utils/razorpay';
import axios from 'axios';

const CustomerWallet = () => {
  const { user, updateProfile } = useAuth();
  const [walletBalance, setWalletBalance] = useState(user?.wallet || 0);
  const [addMoneyDialog, setAddMoneyDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get('/api/payments/wallet-balance');
      if (response.data.success) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/payments/history');
      if (response.data.success) {
        setTransactions(response.data.payments);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleAddMoney = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 10 || amountNum > 10000) {
      setError('Amount must be between ₹10 and ₹10,000');
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await axios.post('/api/payments/add-to-wallet', {
        amount: amountNum
      });

      if (orderResponse.data.success) {
        // Use Razorpay utility for payment
        initiatePayment(
          {
            ...orderResponse.data.order,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone
          },
          async (paymentResponse) => {
            try {
              // Verify payment
              const verifyResponse = await axios.post('/api/payments/verify-wallet-payment', {
                ...paymentResponse,
                amount: amountNum
              });

              if (verifyResponse.data.success) {
                setSuccess(`₹${amountNum} added to wallet successfully!`);
                setWalletBalance(verifyResponse.data.walletBalance);
                setAddMoneyDialog(false);
                setAmount('');
                fetchTransactions();
                
                // Update user context
                if (updateProfile) {
                  updateProfile({ wallet: verifyResponse.data.walletBalance });
                }
              }
            } catch (error) {
              setError('Payment verification failed');
            }
          },
          (error) => {
            setError(`Payment failed: ${error}`);
          }
        );
      }
    } catch (error) {
      setError('Failed to initiate payment');
    }
    setLoading(false);
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? 'success' : 'error';
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? '+' : '-';
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        My Wallet
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Wallet Balance Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Wallet Balance
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    ₹{walletBalance}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
                startIcon={<Add />}
                onClick={() => setAddMoneyDialog(true)}
              >
                Add Money
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setAddMoneyDialog(true)}
                  >
                    Add Money to Wallet
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<History />}
                    onClick={fetchTransactions}
                  >
                    Refresh Transactions
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <History sx={{ mr: 1 }} />
                Transaction History
              </Typography>
            </Box>
            
            {transactions.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <AttachMoney sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No transactions yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Add money to your wallet or book a ride to see transactions
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.transactionId}>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {transaction.transactionId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type.toUpperCase()}
                            color={getTransactionColor(transaction.type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body1"
                            sx={{
                              color: transaction.type === 'credit' ? '#4caf50' : '#f44336',
                              fontWeight: 600
                            }}
                          >
                            {getTransactionIcon(transaction.type)}₹{transaction.amount}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Money Dialog */}
      <Dialog open={addMoneyDialog} onClose={() => setAddMoneyDialog(false)}>
        <DialogTitle>Add Money to Wallet</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Add money to your RYDO wallet for quick and easy payments
          </Typography>
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 10, max: 10000 }}
            helperText="Minimum ₹10, Maximum ₹10,000"
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Quick amounts:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[100, 200, 500, 1000, 2000].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  size="small"
                  variant="outlined"
                  onClick={() => setAmount(quickAmount.toString())}
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMoneyDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddMoney} 
            variant="contained"
            disabled={loading || !amount || parseFloat(amount) < 10}
          >
            {loading ? 'Processing...' : 'Add Money'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </Box>
  );
};

export default CustomerWallet;

