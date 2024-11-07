import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { RiArrowDownSFill } from 'react-icons/ri';
import { Dropdown } from '../dropdown/Dropdown';
import { getUserProfile } from '../../api/profile';
import { generateAddress } from '../../api/ekzat';
import './deposit-modal.scss';
import { FaCopy } from 'react-icons/fa';
import QRCode from "react-qr-code";

export const DepositHiveModal = ({ isOpen, onClose, assets, user }) => {

  const dispatch = useDispatch()

  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [openList, setOpenList] = useState(false);
  const  [displaySearch , setDisplaySearch] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedAsset?.depositAddress);
    toast.success("Address copied to clipboarc!",{
    style: {
      backgroundColor: 'rgba(229, 229, 229, 0.1)',
      color: '#fff',
      fontSize: '16px',
      marginTop: "60px"
    },
  });
  };
  
  const handleCopyMemo = () => {
    navigator.clipboard.writeText(selectedAsset?.memo);
    toast.success("Memo copied to clipboarc!", {
      style: {
        backgroundColor: 'rgba(229, 229, 229, 0.1)',
        color: '#fff',
        fontSize: '16px',
        marginTop: "60px"
      },
    });
  };

  const handleOpencoinList = () => {
    setOpenList(!openList);
  };

  const createAddress = async (symbol) => {
    setLoading(true)
    try {
      const respone = await generateAddress(symbol);
      if (respone.success) {
        toast.success("Account created successfully",{
          style: {
            backgroundColor: 'rgba(229, 229, 229, 0.1)',
            color: '#fff',
            fontSize: '16px',
            marginTop: "60px"
          },
        });

        getUserProfile(dispatch);
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className={`fadded-container modal-overlay ${isOpen ? 'open' : ''}`} >
    <div className={`modal-overlay  ${isOpen ? 'open' : ''}`} onClick={onClose}> </div>
      <div className="modal ">
        <span className="close-modal" onClick={onClose}>X</span>
        <h2 className='d-header'>Deposit</h2>
        <div className='d-main'>
          <div className='d-coin-select-wrapper'>
            <span>{selectedAsset?.currency}</span>
            <div className="d-currency-select-wrap" onClick={handleOpencoinList}>
              <img className="d-coin-wrap" src={selectedAsset?.image} alt="" />
              <span className='d-picker-currency'>{selectedAsset?.currency}</span>
              <RiArrowDownSFill  size={24}/>
              <Dropdown 
              user={user}
              setCurrency={setSelectedAsset} 
              handleOpencoinList={handleOpencoinList} 
              openList={openList}
              displaySearch={displaySearch} />

            </div>

          </div>
        </div>

        <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "30%", width: "30%" }}
    value={selectedAsset?.depositAddress}
    viewBox={`0 0 256 256`}
  />

        {selectedAsset?.depositAddress &&
        <div className="deposit-address">
          <span>Deposit Address:</span>
            {/* <span 
            className='deposit-address-info-el'
            onClick={handleCopyAddress}
            >
              {selectedAsset?.depositAddress}  <FaCopy size={20}/>
          </span> */}
          <div className="wrap">
            <span>{selectedAsset?.depositAddress}</span>
            <FaCopy className='copy-icon' onClick={handleCopyAddress} size={20}/>
          </div>
        </div>}

         {!selectedAsset?.depositAddress && <div className="deposit-address">
          <h3 className='warning'>{selectedAsset?.currency}({selectedAsset?.symbol?.toUpperCase()})  deposit is coming soon...</h3>
          <span className='deposit-address-info-el'>No address/network available for this asset yet</span>
        </div>}

        {selectedAsset?.memo && <div className="deposit-address">
          <span className='warning'>(please make sure you copy your memo correctly)</span>
          <span>Deposit Memo:</span> 
          <div className="wrap">
            <span>{selectedAsset?.memo}</span>
            <FaCopy className='copy-icon' onClick={handleCopyMemo} size={20}/>
          </div>
        </div>}

        <div className="note-wrap">
          <header>Please Note:</header>
          <ul>
            <li>Sending {selectedAsset?.currency} without Memo will result loss of your deposit</li>
            <li>Send only {selectedAsset?.currency} to this address</li>
            <li>Scan QR Code to make deposit</li>
          </ul>
        </div>


      </div>
    </div>
  );
};
