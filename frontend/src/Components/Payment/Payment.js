import React, { useState, useEffect } from 'react';
import './Payment.css';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as MastercardLogo } from './assets/mastercard.svg';
import { ReactComponent as ChipIcon } from './assets/chip.svg';

function Payment() {
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cvv: '',
        expiryMonth: '',
        expiryYear: '',
        password: ''
    });

    const [timer, setTimer] = useState(1003); // Initial timer value
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1);
        }
        return () => clearInterval(interval);
    }, [timer]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cardNumber') {
            setCardDetails({
                ...cardDetails,
                [name]: formatCardNumber(value)
            });
        } else {
            setCardDetails({
                ...cardDetails,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Here you would typically make an API call to your payment processor
            // For demo purposes, we'll just show a success message
            alert('Payment Successful!');
            navigate('/success');
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div>
            <Nav />
            <div className="payment-container">
                <div className="payment-card">
                    <div className="payment-header">
                        <div className="payment-logo">
                            <MastercardLogo className="logo-icon" />
                            <span>Meiranpay</span>
                        </div>
                        <div className="payment-timer">
                            {String(Math.floor(timer / 1000)).padStart(2, '0')}:
                            {String(timer % 1000).padStart(3, '0')}
                        </div>
                    </div>

                    <div className="payment-form-container">
                        <div className="payment-form">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <div className="card-input-wrapper">
                                        <MastercardLogo className="card-icon" />
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={cardDetails.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter the 16-digit card number on the card"
                                            maxLength="19"
                                            required
                                        />
                                        {cardDetails.cardNumber.length >= 16 && <span className="check-icon">✓</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>CVV Number</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            name="cvv"
                                            value={cardDetails.cvv}
                                            onChange={handleInputChange}
                                            placeholder="Enter the 3 or 4 digit number on the card"
                                            maxLength="4"
                                            required
                                        />
                                        <button type="button" className="show-hide-btn">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <div className="expiry-inputs">
                                        <input
                                            type="text"
                                            name="expiryMonth"
                                            value={cardDetails.expiryMonth}
                                            onChange={handleInputChange}
                                            placeholder="10"
                                            maxLength="2"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="expiryYear"
                                            value={cardDetails.expiryYear}
                                            onChange={handleInputChange}
                                            placeholder="24"
                                            maxLength="2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            name="password"
                                            value={cardDetails.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your Dynamic password"
                                            required
                                        />
                                        <button type="button" className="show-hide-btn">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="pay-now-btn">
                                    Pay Now
                                </button>
                            </form>
                        </div>

                        <div className="payment-details">
                            <div className="card-preview">
                                <ChipIcon className="card-chip" />
                                <div className="card-wifi"></div>
                                <div className="card-holder">Aduke Morewa</div>
                                <div className="card-number">•••• 3456</div>
                                <div className="card-expiry">09/24</div>
                                <MastercardLogo className="card-brand" />
                            </div>

                            <div className="payment-info">
                                <div className="info-row">
                                    <span>Company</span>
                                    <span>Samsung</span>
                                </div>
                                <div className="info-row">
                                    <span>Order Number</span>
                                    <span>1443356</span>
                                </div>
                                <div className="info-row">
                                    <span>Product</span>
                                    <span>Galaxy S22</span>
                                </div>
                                <div className="info-row">
                                    <span>VAT(20%)</span>
                                    <span>$100.00</span>
                                </div>
                                <div className="total-amount">
                                    <span>You have to Pay</span>
                                    <span className="amount">800.00 USD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment; 