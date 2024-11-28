import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { confirmDeposit, cancelDeposit, getAllDeposits } from '../../api/admin';
import './confirm-deposit.css';

export const ConfirmDepositPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);

  useEffect(() => {
    getDeposits();
  }, []);

  useEffect(() => {
    setFilteredDeposits(deposits);
  }, [deposits]);

  const getDeposits = async () => {
    try {
      const response = await getAllDeposits();
      setDeposits(response?.deposits);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    }
  };

  const handleConfirmDeposit = async (depositId) => {
    try {
      await confirmDeposit(depositId);

      setDeposits(prevDeposits => prevDeposits.filter(deposit => deposit._id !== depositId));
    } catch (error) {
      console.error('Error confirming deposit:', error);
    }
  };

  const handleCancelDeposit = async (depositId) => {
    try {

      await cancelDeposit(depositId);

      setDeposits(prevDeposits => prevDeposits.filter(deposit => deposit._id !== depositId));
    } catch (error) {
      console.error('Error canceling deposit:', error);
    }
  };

  const handleFilter = (status) => {

    if (status === 'all') {
      setFilteredDeposits(deposits);
    } else {
      const filtered = deposits.filter(deposit => deposit.status === status);
      setFilteredDeposits(filtered);
    }
  };

  return (
    <div className="confirm-deposit-container">
      <h1>Manage Deposits</h1>
      <div className="filter-buttons">
        <button onClick={() => handleFilter('all')}>All</button>
        <button onClick={() => handleFilter('Pending')}>Pending</button>
        <button onClick={() => handleFilter('Confirmed')}>Confirmed</button>
        <button onClick={() => handleFilter('Canceled')}>Canceled</button>
      </div>
      <div className="deposit-c">
        {filteredDeposits.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul className="deposit-list">
            <li className="deposit-item labels">
              <p>User</p>
              <p>Amount</p>
              <p>Date</p>
              <p>Status</p>
              <p>Action</p>
            </li>
            {filteredDeposits.map(deposit => (
              <li key={deposit._id} className="deposit-item">
                <p>{deposit.user}</p>
                <p>{(deposit.amount)}</p>
                <p>{new Date(deposit.createdAt).toLocaleString()}</p>
                <p> 
                  <span
                    className={
                      deposit.status === 'Confirmed' ? 'confirmed-status' :
                      deposit.status === 'Pending' ? 'pending-status' :
                      deposit.status === 'Canceled' ? 'canceled-status' :
                      ''
                    }
                  >
                    {deposit.status}
                  </span>
                </p>
                {deposit.status === "Confirmed" && "Completed  ✅✅✅✅"}
                {deposit.status === "Canceled" && "Canceled ❌❌❌❌"}
                {deposit.status === "Pending" && <div className="button-container">
                  <button className="confirm-btn" onClick={() => handleConfirmDeposit(deposit._id)}>Confirm</button>
                  <button className="cancel-btn" onClick={() => handleCancelDeposit(deposit._id)}>Cancel</button>
                </div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
