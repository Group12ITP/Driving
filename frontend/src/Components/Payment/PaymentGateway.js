import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WifiIcon from '@mui/icons-material/Wifi';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 1000,
    margin: 'auto',
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const CardNumberInput = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
            borderColor: '#1976d2',
        },
    },
});

const PaymentGateway = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handleCardNumberChange = (event) => {
        const formatted = formatCardNumber(event.target.value);
        setCardNumber(formatted);
    };

    return (
        <StyledCard>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Box display="flex" alignItems="center" mb={3}>
                        <CreditCardIcon sx={{ fontSize: 40, marginRight: 1, color: '#1976d2' }} />
                        <Typography variant="h5" component="h1">
                            MeiranPay
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>
                            10:03
                        </Typography>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="subtitle1" gutterBottom>
                            Card Number
                        </Typography>
                        <CardNumberInput
                            fullWidth
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="Enter the 16-digit card number on the card"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                CVV Number
                            </Typography>
                            <TextField
                                fullWidth
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="Enter the 3 or 4 digit number on the card"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Expiry Date
                            </Typography>
                            <Box display="flex" gap={2}>
                                <TextField
                                    placeholder="10"
                                    value={expiryMonth}
                                    onChange={(e) => setExpiryMonth(e.target.value)}
                                    sx={{ width: '45%' }}
                                />
                                <TextField
                                    placeholder="24"
                                    value={expiryYear}
                                    onChange={(e) => setExpiryYear(e.target.value)}
                                    sx={{ width: '45%' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box mt={3}>
                        <Typography variant="subtitle1" gutterBottom>
                            Password
                        </Typography>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Dynamic password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 4,
                            bgcolor: '#0066ff',
                            borderRadius: 2,
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                        }}
                    >
                        Pay Now
                    </Button>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            bgcolor: '#f8faff',
                            boxShadow: 'none',
                            borderRadius: 4,
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 3,
                                p: 2,
                                mb: 2,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 200
                            }}
                        >
                            <CreditCardIcon sx={{ fontSize: 100, color: '#1976d2' }} />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                }}
                            >
                                <WifiIcon />
                            </Box>
                        </Box>

                        <Typography variant="subtitle1" gutterBottom>
                            Order Details
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography color="text.secondary">Company</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">Samsung</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography color="text.secondary">Order Number</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">1443566</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography color="text.secondary">Product</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">Galaxy S22</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography color="text.secondary">VAT (20%)</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">$100.00</Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                You have to Pay
                            </Typography>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                800.00 <Typography component="span">USD</Typography>
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </StyledCard>
    );
};

export default PaymentGateway; 