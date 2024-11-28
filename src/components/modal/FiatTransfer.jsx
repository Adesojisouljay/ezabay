import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fiatTransfer } from '../../api/ekzat';
import { getUserProfile, getReceiverProfile } from '../../api/profile';
import { Loader } from '../loader/Loader';
// import './deposit-modal.scss';
import "./fiatransfer.scss"


export const DepositModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [loading, setLoading] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState(null)

  const notAllowed = loading || !receiver || !amount;

  useEffect(() => {
    if(receiver) {
     setTimeout(() => {
      getReceiver()
    },3000);
    } else {
      setReceiverInfo(null)
    }
  }, [receiver])

  const handleFiatTransfer = async () => {
    setLoading(true)
    try {
      const result = await fiatTransfer({ receiverIdentifier: receiver, amount });
      setLoading(false)
      toast.success(`Fiat transfer to ${receiver} successful`, {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
      onClose();
      getUserProfile(dispatch)
    } catch (error) {
      console.error("Error during fiat transfer:", error);
      setLoading(false);
      toast.error(error.message, {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
    }
  };
  
  const getReceiver = async () => {
    setLoading(true);
    if(!receiver) return;
    try {

      const data = await getReceiverProfile(receiver);
      setReceiverInfo(data)
      setLoading(false);

    } catch (error) {

      setLoading(false);
      setReceiverInfo(null)

      toast.error(error.message, {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
    }
  }

  return (
    <div className={`f-t-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className={`f-t-modal-overlay  ${isOpen ? 'open' : ''}`} onClick={onClose}> </div>
      <div className="f-t-modal">
        <span className="close-modal" onClick={onClose}>X</span>
        <div className="fiattransfer-container">
        <h2>Transfer Fiat</h2> 
        {loading && <Loader />}
        <div className="ftr-input-group">
          <label htmlFor="receiver">Receiver</label>
          <input 
            type="text" 
            id="receiver" 
            value={receiver} 
            onChange={(e) => setReceiver(e.target.value)} 
            placeholder="Enter recipient" 
          />
          <div>
            {receiverInfo && <div><h4>Transfering to {receiverInfo?.firstName} {receiverInfo?.lastName}</h4></div>}
          </div>
          <label htmlFor="transfer-amount">Amount</label>
          <input 
            type="number" 
            id="transfer-amount" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))} 
            placeholder="Enter amount" 
          />
        </div>
        <button 
          style={{cursor: notAllowed ? "not-allowed" : "pointer"}} 
          disabled={notAllowed} 
          className="deposit-btn" 
          onClick={handleFiatTransfer}
        >Proceed</button>
        </div>
      </div>
    </div>
  );
};
