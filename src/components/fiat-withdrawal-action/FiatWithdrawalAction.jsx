import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { confirmFiatWithdrawal, cancelFiatWithdrawal, getAllFiatWithdrawals } from '../../api/ekzat';
import "./fiat-withdrawal-action.css";

export const FiatWithdrawalAction = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    filterWithdrawals();
  }, [searchTerm, withdrawals]);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFiatWithdrawals();
      setWithdrawals(response.withdrawals);
    } catch (error) {
      toast.error('Failed to fetch fiat withdrawals', {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmWithdrawal = async (withdrawalId, amount) => {
    try {
      await confirmFiatWithdrawal(withdrawalId, amount);
      toast.success('Withdrawal confirmed successfully', {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
      fetchWithdrawals();
    } catch (error) {
      toast.error('Failed to confirm withdrawal', {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
    }
  };

  const handleCancelWithdrawal = async (withdrawalId, amount) => {
    try {
      await cancelFiatWithdrawal(withdrawalId, amount);
      toast.success('Withdrawal canceled successfully', {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
      fetchWithdrawals();
    } catch (error) {
      toast.error('Failed to cancel withdrawal', {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'canceled':
        return 'status-canceled';
      default:
        return '';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'pending':
        return '🕒';
      case 'confirmed':
        return '✅';
      case 'canceled':
        return '❌';
      default:
        return '';
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterWithdrawals = () => {
    const filtered = withdrawals.filter((withdrawal) =>
      withdrawal.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWithdrawals(filtered);
  };

  return (
    <div className="fiat-withdrawal-list">
      <h2>Fiat Withdrawals</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {isLoading ? (
        <p>Loading withdrawals...</p>
      ) : (
        <table className="withdrawals-table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Amount</th>
              <th>Account Name</th>
              <th>Account Number</th>
              <th>Bank Name</th>
              <th>Status</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWithdrawals.length > 0 ? (
              filteredWithdrawals.map((withdrawal, index) => (
                <tr key={withdrawal._id}>
                  <td>{index + 1}</td>
                  <td>{withdrawal.amount}</td>
                  <td>{withdrawal.account.accountName}</td>
                  <td>{withdrawal.account.accountNumber}</td>
                  <td>{withdrawal.account.bankName}</td>
                  <td className={getStatusClass(withdrawal.status)}>
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </td>
                  <td>{withdrawal.user.username}</td>
                  <td>{withdrawal.user.email}</td>
                  <td>
                    {withdrawal.status === 'pending' && (
                      <>
                        <button
                          className="confirm-btn"
                          onClick={() => handleConfirmWithdrawal(withdrawal._id, withdrawal.amount)}
                        >
                          Confirm
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelWithdrawal(withdrawal._id, withdrawal.amount)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {withdrawal.status !== 'pending' && (
                      <span className="status-emoji">
                        {getStatusEmoji(withdrawal.status)}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No withdrawals found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
