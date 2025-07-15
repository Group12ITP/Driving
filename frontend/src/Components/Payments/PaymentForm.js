import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';

const PaymentForm = ({ open, onClose, onSubmit, payment }) => {
  const [formData, setFormData] = useState({
    paymentId: '',
    studentId: '',
    studentName: '',
    courseName: '',
    amount: '',
    paymentDate: '',
    paymentMethod: '',
    status: ''
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        paymentId: payment.paymentId || '',
        studentId: payment.studentId || '',
        studentName: payment.studentName || '',
        courseName: payment.courseName || '',
        amount: payment.amount || '',
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : '',
        paymentMethod: payment.paymentMethod || '',
        status: payment.status || ''
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {payment ? 'Edit Payment' : 'New Payment'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="paymentId"
            label="Payment ID"
            value={formData.paymentId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="studentId"
            label="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="studentName"
            label="Student Name"
            value={formData.studentName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="courseName"
            label="Course Name"
            value={formData.courseName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="amount"
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: '$'
            }}
          />
          <TextField
            name="paymentDate"
            label="Payment Date"
            type="date"
            value={formData.paymentDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="paymentMethod"
            label="Payment Method"
            select
            value={formData.paymentMethod}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Debit Card">Debit Card</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
          </TextField>
          <TextField
            name="status"
            label="Status"
            select
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
            <MenuItem value="Partially Paid">Partially Paid</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {payment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentForm; 