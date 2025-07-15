import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import Nav from '../Nav/Nav';
import PaymentList from './PaymentList';
import AddPayment from './AddPayment';
import './Payments.css';

const Payments = () => {
  const navigate = useNavigate();

  const handleAddPaymentClick = () => {
    // Navigate to the add payment page - using relative path
    navigate("add");
  };

  return (
    <div className="payments-container">
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="payments-page">
              <Nav />
              <div className="payments-header">
                <h1>Payment Management</h1>
                <button 
                  className="add-payment-btn"
                  onClick={handleAddPaymentClick}
                >
                  <FaPlus /> Add New Payment
                </button>
              </div>
              <PaymentList />
            </div>
          } 
        />
        <Route path="add" element={<AddPayment />} />
      </Routes>
    </div>
  );
};

export default Payments; 