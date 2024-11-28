import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { confirmWithdrawal, cancelWithdrawal, getAllWithdrawals } from '../../api/admin';
import './confirm-withdrawal.css';

export const ConfirmWithdrawalPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);

  useEffect(() => {
    getWithdrawals();
  }, []);

  useEffect(() => {
    setFilteredWithdrawals(withdrawals);
  }, [withdrawals]);

  const getWithdrawals = async () => {
    try {
      const response = await getAllWithdrawals();
      setWithdrawals(response?.withdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const handleConfirmWithdrawal = async (withdrawalId) => {
    try {
      await confirmWithdrawal(withdrawalId);

      setWithdrawals(prevWithdrawals => prevWithdrawals.filter(withdrawal => withdrawal._id !== withdrawalId));
    } catch (error) {
      console.error('Error confirming withdrawal:', error);
    }
  };

  const handleCancelWithdrawal = async (withdrawalId) => {
    try {

      await cancelWithdrawal(withdrawalId);

      setWithdrawals(prevWithdrawals => prevWithdrawals.filter(withdrawal => withdrawal._id !== withdrawalId));
    } catch (error) {
      console.error('Error canceling withdrawal:', error);

    }
  };

  const handleFilter = (status) => {

    if (status === 'all') {
      setFilteredWithdrawals(withdrawals);
    } else {
      const filtered = withdrawals.filter(withdrawal => withdrawal.status === status);
      setFilteredWithdrawals(filtered);
    }
  };

  return (
    <div className="confirm-withdrawal-container">
      <h1>Manage Withdrawals</h1>
      <div className="filter-buttons">
        <button onClick={() => handleFilter('all')}>All</button>
        <button onClick={() => handleFilter('Pending')}>Pending</button>
        <button onClick={() => handleFilter('Confirmed')}>Confirmed</button>
        <button onClick={() => handleFilter('Canceled')}>Canceled</button>
      </div>
      <div className="withdrawal-c">
        {filteredWithdrawals.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul className="withdrawal-list">
            <li className="withdrawal-item labels">
              <p>User</p>
              <p>Amount</p>
              <p>Date</p>
              <p>Status</p>
              <p>Action</p>
            </li>
            {filteredWithdrawals.map(withdrawal => (
              <li key={withdrawal._id} className="withdrawal-item">
                <p>{withdrawal.userId}</p>
                <p>{withdrawal.amount}</p>
                <p>{new Date(withdrawal.createdAt).toLocaleString()}</p>
                <p> 
                  <span
                    className={
                      withdrawal.status === 'Confirmed' ? 'confirmed-status' :
                      withdrawal.status === 'Pending' ? 'pending-status' :
                      withdrawal.status === 'Canceled' ? 'canceled-status' :
                      ''
                    }
                  >
                    {withdrawal.status}
                  </span>
                </p>
                {withdrawal.status === "Confirmed" && "Completed  ✅✅✅✅"}
                {withdrawal.status === "Canceled" && "Canceled ❌❌❌❌"}
                {withdrawal.status === "Pending" && <div className="button-container">
                  <button className="confirm-btn" onClick={() => handleConfirmWithdrawal(withdrawal._id)}>Confirm</button>
                  <button className="cancel-btn" onClick={() => handleCancelWithdrawal(withdrawal._id)}>Cancel</button>
                </div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
