import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaSearch, FaSort, FaFilter, FaFileDownload, FaPrint } from 'react-icons/fa';
import PaymentForm from './PaymentForm';
import './Payments.css';

const PaymentList = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('paymentDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const componentRef = useRef();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/payments');
      setPayments(response.data.payments || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payment data. Please try again later.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`http://localhost:5000/payments/${paymentId}`);
        await fetchPayments();
        setError(null);
      } catch (err) {
        setError('Failed to delete payment. Please try again later.');
        console.error(err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedPayment) {
        await axios.put(`http://localhost:5000/payments/${selectedPayment._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/payments', formData);
      }
      await fetchPayments();
      setIsModalOpen(false);
      setSelectedPayment(null);
      setError(null);
    } catch (err) {
      setError('Failed to save payment. Please try again later.');
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (!payments) return;
    
    const filteredPayments = payments.filter((payment) =>
      Object.values(payment).some((field) =>
        field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    
    setPayments(filteredPayments);
    setNoResults(filteredPayments.length === 0);
  };

  const handlePrint = () => {
    const input = componentRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('payments-report.pdf');
    });
  };

  const handleSendReport = () => {
    const phoneNumber = "+94766324158";
    const message = `Payment Reports`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(WhatsAppUrl, "_blank");
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const filteredPayments = payments
    ? payments
      .filter(payment => 
        (statusFilter === '' || payment.status === statusFilter))
      .sort((a, b) => {
        if (sortField === 'amount' || sortField === 'totalAmount') {
          return sortDirection === 'asc' 
            ? a[sortField] - b[sortField] 
            : b[sortField] - a[sortField];
        } else if (sortField === 'paymentDate' || sortField === 'dueDate') {
          return sortDirection === 'asc'
            ? new Date(a[sortField]) - new Date(b[sortField])
            : new Date(b[sortField]) - new Date(a[sortField]);
        } else {
          return sortDirection === 'asc'
            ? (a[sortField] || '').localeCompare(b[sortField] || '')
            : (b[sortField] || '').localeCompare(a[sortField] || '');
        }
      })
    : [];

  return (
    <>
      <div className="search-container">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          name="search"
          placeholder="Search Payments"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="filter-container">
        <select 
          value={statusFilter} 
          onChange={handleStatusFilter}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
          <option value="Partially Paid">Partially Paid</option>
        </select>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}

      {noResults ? (
        <div className="no-results">
          <p>No Payments Found</p>
        </div>
      ) : (
        <div ref={componentRef} className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th onClick={() => {
                  setSortField('paymentId');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Payment ID {sortField === 'paymentId' && <FaSort className={`sort-icon ${sortDirection}`} />}
                </th>
                <th onClick={() => {
                  setSortField('studentId');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Student ID {sortField === 'studentId' && <FaSort className={`sort-icon ${sortDirection}`} />}
                </th>
                <th onClick={() => {
                  setSortField('studentName');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Student Name {sortField === 'studentName' && <FaSort className={`sort-icon ${sortDirection}`} />}
                </th>
                <th onClick={() => {
                  setSortField('courseName');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Course {sortField === 'courseName' && <FaSort className={`sort-icon ${sortDirection}`} />}
                </th>
                <th onClick={() => {
                  setSortField('amount');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Amount {sortField === 'amount' && <FaSort className={`sort-icon ${sortDirection}`} />}
                </th>
                <th onClick={() => {
                  setSortField('paymentDate');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Payment Date {sortField === 'paymentDate' && <FaSort className={`sort-icon ${sortDirection}`} />}
                </th>
                <th onClick={() => {
                  setSortField('paymentMethod');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Method {sortField === 'paymentMethod' && <FaSort className={`sort-icon ${sortDirection}`} />}
                </th>
                <th onClick={() => {
                  setSortField('status');
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                }}>
                  Status {sortField === 'status' && <FaSort className={`sort-icon ${sortDirection}`} />}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => (
                  <tr key={payment._id || payment.paymentId}>
                    <td>{payment.paymentId}</td>
                    <td>{payment.studentId}</td>
                    <td>{payment.studentName}</td>
                    <td>{payment.courseName}</td>
                    <td>${payment.amount ? payment.amount.toFixed(2) : '0.00'}</td>
                    <td>{payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}</td>
                    <td>{payment.paymentMethod}</td>
                    <td>
                      <span className={`status-badge ${payment.status ? payment.status.toLowerCase().replace(' ', '-') : ''}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(payment)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(payment._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">No payment data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="button-container">
        <button className="button-1" onClick={handlePrint}>Download Report</button>
        <button className="button-2" onClick={handleSendReport}>Send WhatsApp Message</button>
      </div>

      <PaymentForm
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
        onSubmit={handleSubmit}
        payment={selectedPayment}
      />
    </>
  );
};

export default PaymentList; 