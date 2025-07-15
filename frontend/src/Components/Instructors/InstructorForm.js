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

const InstructorForm = ({ open, onClose, onSubmit, instructor }) => {
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    phone: '',
    gender: '',
    age: '',
    experience: '',
    hiredate: '',
    salary: '',
    workinghours: '',
    licenseNumber: '',
    vehcleId: ''
  });

  useEffect(() => {
    if (instructor) {
      setFormData({
        name: instructor.name || '',
        gmail: instructor.gmail || '',
        phone: instructor.phone || '',
        gender: instructor.gender || '',
        age: instructor.age || '',
        experience: instructor.experience || '',
        hiredate: instructor.hiredate ? new Date(instructor.hiredate).toISOString().split('T')[0] : '',
        salary: instructor.salary || '',
        workinghours: instructor.workinghours || '',
        licenseNumber: instructor.licenseNumber || '',
        vehcleId: instructor.vehcleId || ''
      });
    }
  }, [instructor]);

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
        {instructor ? 'Edit Instructor' : 'New Instructor'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="gmail"
            label="Email"
            type="email"
            value={formData.gmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="gender"
            label="Gender"
            select
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            name="age"
            label="Age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="experience"
            label="Experience (years)"
            type="number"
            value={formData.experience}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="hiredate"
            label="Hire Date"
            type="date"
            value={formData.hiredate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="salary"
            label="Salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: '$'
            }}
          />
          <TextField
            name="workinghours"
            label="Working Hours"
            value={formData.workinghours}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="licenseNumber"
            label="License Number"
            value={formData.licenseNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="vehcleId"
            label="Vehicle ID"
            value={formData.vehcleId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {instructor ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InstructorForm; 