import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBankAccount, deleteBankAccount } from '../api/ekzat';
import { getUserProfile } from '../api/profile';
import { Loader } from '../components/loader/Loader';
import './add-bank-account.scss';

export const BankAccount = ({ authToken }) => {
  const user = useSelector(state => state.ekzaUser.user);
  const dispatch = useDispatch();

  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const validateForm = () => {
    const accountNumberRegex = /^\d{10,12}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!accountNumberRegex.test(accountNumber)) {
      setMessage('Invalid account number. It should be between 10 and 12 digits.');
      return false;
    }
    if (!nameRegex.test(accountName)) {
      setMessage('Invalid account name. It should only contain letters and spaces.');
      return false;
    }
    if (!nameRegex.test(bankName)) {
      setMessage('Invalid bank name. It should only contain letters and spaces.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (!validateForm()) return;

    const bankDetails = {
      accountNumber,
      accountName,
      bankName
    };

    try {
      await addBankAccount(bankDetails, authToken);
      getUserProfile(dispatch)
      setIsSuccess(true);
      setMessage('Bank account added successfully');
      setAccountNumber("")
      setBankName("")
      setAccountName("")
      setLoading(false)
      setMessage('');
    } catch (error) {
      setIsSuccess(false);
      setMessage('Error adding bank account');
      setLoading(false)
    }
  };

  const deleteAccount = async (id)=> {
    setDeleting(true)
    try {
      const data = await deleteBankAccount(id);
      getUserProfile(dispatch)
      setDeleting(false)
    } catch (error) {
      console.log(error)
      setDeleting(false)
    }
  }

  return (
    <div className="bank-account">
      <div className="accounts">
        {user?.accounts?.length === 0 ?<div className='no-account'>
          <h2 className='no-account-text'>You have not added any bank account yet</h2>
        </div> :
        <>
          { <div>
            {user?.accounts?.map((account, index) => (
              <div key={index} className="bank-account-item">
                  {deleting && <Loader/>}
                  <p><strong>Bank Name:</strong> {account.bankName}</p>
                  <p><strong>Account Name:</strong> {account.accountName}</p>
                  <p><strong>Account Number:</strong> {account.accountNumber}</p>
                  <button className='delete-btn' onClick={()=> deleteAccount(account.id)}>Delete Account</button>
                </div>
              ))}
          </div>}
        </>
        }
      </div>
      <div className="form-container">
        {isSuccess ? (
          <div className="success-message">
            <h2>Success!</h2>
            <p>{message}</p>
            <button onClick={()=> setIsSuccess(false)}>Go back</button>
          </div>
        ) : (
          <>
          {loading && <Loader/>}
            <form onSubmit={handleSubmit} className="bank-form">
              <div className="form-group">
                <h1 style={{color: "green"}}>Add New Bank Account</h1>
                {message && <span className='warning'>{message}</span>}
                <h5 style={{color: "orange"}}>Please make sure you enter your details as accurately as possible</h5>
                <label className="label">Account Number:</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="form-group">
                <label className="label">Account Name:</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="form-group">
                <label className="label">Bank Name:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <button type="submit" className="button">Add Bank Account</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
