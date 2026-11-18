import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Remove,
  CreditCard,
  AccountBalance,
  Phone,
  TrendingUp,
  TrendingDown,
  Receipt
} from '@mui/icons-material';

const transactions = [
  {
    id: 1,
    type: 'credit',
    amount: 500,
    description: 'Wallet Top-up',
    date: '2024-01-15',
    method: 'UPI'
  },
  {
    id: 2,
    type: 'debit',
    amount: 85,
    description: 'Bike Taxi - Connaught Place to India Gate',
    date: '2024-01-15',
    method: 'wallet'
  },
  {
    id: 3,
    type: 'debit',
    amount: 150,
    description: 'Auto/Car - Karol Bagh to Lajpat Nagar',
    date: '2024-01-14',
    method: 'wallet'
  },
  {
    id: 4,
    type: 'credit',
    amount: 50,
    description: 'Referral Bonus',
    date: '2024-01-13',
    method: 'bonus'
  }
];

const Wallet = () => {
  const [balance, setBalance] = useState(315);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const handleAddMoney = () => {
    const addAmount = parseInt(amount);
    if (addAmount > 0) {
      setBalance(prev => prev + addAmount);
      setAddMoneyOpen(false);
      setAmount('');
    }
  };

  const quickAmounts = [100, 200, 500, 1000];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        RYDO Wallet
      </Typography>

      {/* Balance Card */}
      <Card 
        elevation={3}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 4
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Available Balance
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                ₹{balance}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddMoneyOpen(true)}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Add Money
            </Button>
            <Button
              variant="outlined"
              startIcon={<Receipt />}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': { borderColor: 'white' }
              }}
            >
              Transaction History
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Add Money
        </Typography>
        <Grid container spacing={2}>
          {quickAmounts.map((amt) => (
            <Grid item xs={6} sm={3} key={amt}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setBalance(prev => prev + amt);
                }}
                sx={{ py: 2 }}
              >
                +₹{amt}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Transaction History */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Recent Transactions
        </Typography>
        
        <List>
          {transactions.map((transaction, index) => (
            <React.Fragment key={transaction.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  {transaction.type === 'credit' ? (
                    <TrendingUp color="success" />
                  ) : (
                    <TrendingDown color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={transaction.description}
                  secondary={`${transaction.date} • ${transaction.method.toUpperCase()}`}
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="h6"
                    color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                    fontWeight="bold"
                  >
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </Typography>
                  <Chip
                    label={transaction.type.toUpperCase()}
                    size="small"
                    color={transaction.type === 'credit' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
              </ListItem>
              {index < transactions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Add Money Dialog */}
      <Dialog open={addMoneyOpen} onClose={() => setAddMoneyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Money to Wallet</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
            }}
          />
          
          <Typography variant="subtitle2" gutterBottom>
            Quick Select:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {quickAmounts.map((amt) => (
              <Chip
                key={amt}
                label={`₹${amt}`}
                onClick={() => setAmount(amt.toString())}
                variant={amount === amt.toString() ? 'filled' : 'outlined'}
                color="primary"
              />
            ))}
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Payment Methods:
          </Typography>
          <List>
            <ListItem button>
              <ListItemIcon>
                <CreditCard />
              </ListItemIcon>
              <ListItemText primary="Credit/Debit Card" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Phone />
              </ListItemIcon>
              <ListItemText primary="UPI" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <AccountBalance />
              </ListItemIcon>
              <ListItemText primary="Net Banking" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMoneyOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddMoney}
            disabled={!amount || parseInt(amount) <= 0}
          >
            Add ₹{amount || 0}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wallet;