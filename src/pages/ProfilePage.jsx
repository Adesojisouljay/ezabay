import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { BsPencilFill, BsPlusCircleFill, BsTrashFill, BsCloudUploadFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { PasswordReset } from '../components/modal/PasswordReset';
import { AddAccount } from '../components/modal/AddAccount';
import { ConfirmModal } from '../components/modal/ConfirmModal';
import { deleteBankAccount, updateProfile } from '../api/ekzat';
import { getUserProfile } from '../api/profile';
import { Loader } from '../components/loader/Loader';
import './profile.scss';
import { currenciesList, userAvatar } from '../vairables/protectedRoutes';
import { FaCopy } from 'react-icons/fa';
import { GeneralDropdown } from '../components/dropdown/GeneralDrpdpown';
import { setCurrency } from '../redux/currencySlice';

export const Profile = () => {
  
    const global = useSelector(state => state.ekzaUser)
    const selectedCurrency = useSelector((state) => state.currency.selectedCurrency);
    const user = global?.user;
    const dispatch = useDispatch()

  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [showTitle, setShowTitle] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [tooltipText, setTooltipText] = useState("")
  const [openDeleteAcc, setOpenDeleteAcc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState("")
  const [openList,  setOpenList] = useState(false)


  const appBaseUrl = window.location.origin
const userReferralLink = `${appBaseUrl}/register?referral=${user.userMemo}`
console.log(userReferralLink)

  const handleEdit = () => {
    setEditMode(true);
    setNewEmail(user.email);
  };

  const getKycStatusClass = (status) => {
    switch (status) {
        case 'verified':
            return 'kyc-approved';
        case 'rejected':
            return 'kyc-rejected';
        case 'pending':
            return 'kyc-pending';
        default:
            return '';
    }
};
const handleOpenList = () => {
  setOpenList(!openList);
};

const openPassword = () => {
    setOpenPasswordModal(true)
}

const closePassword = () => {
    setOpenPasswordModal(false)
}

const openAccount = () => {
  setOpenAccountModal(true)
}

const closeAccount = () => {
    setOpenAccountModal(false)
}

const closeDeleteAccount = () => {
  setOpenDeleteAcc(false)
}

const openDeleteAccount = () => {
  setOpenDeleteAcc(true)
}

const showTooltip = (type) => {
  setShowTitle(true)
  
  if(type === "password") {
    setTooltipText("Change Password")
  } else if(type === "account") {
    setTooltipText("Add new account")
  }
}

const handleCopyMemo = () => {
  navigator.clipboard.writeText(userReferralLink);
  toast.success("Referral link copied to clipboard!", {
    style: {
      backgroundColor: 'rgba(229, 229, 229, 0.1)',
      color: '#fff',
      fontSize: '16px',
      marginTop: "60px"
    },
  });
};

const handleCurrencyChange = (currency) => {
  console.log(currency)
  const selectedC = currenciesList.find(c => c.name === currency);
  console.log(selectedC)
  dispatch(setCurrency(currency));
};

const deleteAcc = async ()=> {
  setLoading(true)
  try {
    const data = await deleteBankAccount(accountId);
    if(data.success) {
      toast.success("Account deleted successfully.", {
        style: {
          backgroundColor: 'rgba(229, 229, 229, 0.1)',
          color: '#fff',
          fontSize: '16px',
          marginTop: "60px"
        },
      });
      getUserProfile(dispatch)
      setLoading(false)
      closeDeleteAccount();
    }
  } catch (error) {
    toast.error("An error occured.", {
      style: {
        backgroundColor: 'rgba(229, 229, 229, 0.1)',
        color: '#fff',
        fontSize: '16px',
        marginTop: "60px"
      },
    });
    console.log(error)
    setLoading(false)
  }
}


const idUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const uploadProfilePicture = async () => {
    setLoading(true)
    try {
      const profileFormData = new FormData();
      profileFormData.append('file', userProfileImage);
      profileFormData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
      
      const response2 = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, profileFormData);
      const profileImage = response2.data.secure_url;
      const dataToUpdate = { profileImage };
      const response = await updateProfile(dataToUpdate)
      if(response.success) {
        toast.success("Profile image updated successfully",{
          style: {
            backgroundColor: 'rgba(229, 229, 229, 0.1)',
            color: '#fff',
            fontSize: '16px',
            marginTop: "60px"
          },
        });
        getUserProfile(dispatch)
        setLoading(false)
        setUserProfileImage(null)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user?.profileImage || userAvatar}
          alt="Profile"
          className="profile-avatar"
        />
        <h2>{`${user?.firstName} ${user?.lastName} ${user?.otherName || ''}`}</h2>
        <p>Username: {user?.username}</p>
        <p>Account created on: {new Date(user.createdAt).toLocaleDateString()}</p>
        {/* <p className={`kyc-status`}>
            KYC Status: <span className={`kyc-status ${getKycStatusClass(user?.kyc?.kycStatus)}`}>{user?.kyc?.kycStatus}</span>
        </p> */}
        {/* <h2 className="edit-title" onClick={handleEdit}>
          Customize Your Profile
        </h2> */}
      </div>

      <div className="bal-text-select-wrap">
                <GeneralDropdown
                  items={currenciesList}
                  setSelectedItem={handleCurrencyChange} 
                  handleOpenList={handleOpenList} 
                  openList={openList}
                  itemName={selectedCurrency}
                />

               </div>

      <div className="profile-details">
        <div className="detail-item">
          <span>Email:</span>
            <input 
                value={newEmail || "" || user.email} 
                readOnly
            />
        </div>
          <div className="detail-item">
            <label htmlFor="profileImage">Profile Image:</label>
            <div className="image-select-input">
              <input
                type="file"
                id="profileImage"
                onChange={idUpload}
              />
              <button
                onClick={uploadProfilePicture}
                disabled={!userProfileImage || loading}
                style={{cursor: (!userProfileImage || loading) && "not-allowed"}}
              >
                {loading ? "Uploading Image..." : <>Upload Image <BsCloudUploadFill/></>}
              </button>
              
            </div>
          </div>
        
            <div className="detail-item profile-password-reset">
            <span>Change password</span>
            <div 
              className='edit-pencil-wrap'
              onClick={openPassword}
              onMouseEnter={() => { 
                showTooltip("password")
              }}
              onMouseLeave={() => setShowTitle(false)}
              onTouchStart={() => { 
                showTooltip("password")
              }}
              onTouchEnd={() => setShowTitle(false)}
            >
              {(showTitle && tooltipText === "Change Password") && <span style={{position: "absolute", right: 40, width: "max-content", marginRight: 5}}>
                  {tooltipText}
              </span>}
              <BsPencilFill />
            </div>

            </div>

            <div className='detail-item profile-account-wrap'>
              <div>
                <div className="wrap">
                <h3>Bank Accounts</h3>
                <div 
                className='add-acct-pencil-wrap edit-pencil-phone' 
                onClick={openAccount}
                onMouseEnter={() => { 
                  showTooltip("account")
                }}
                onMouseLeave={() => setShowTitle(false)}
                onTouchStart={() => { 
                  showTooltip("account")
                }}
                onTouchEnd={() => setShowTitle(false)}
              >
                {(showTitle && tooltipText === "Add new account") && <span style={{position: "absolute", right: 40, width: "max-content", marginRight: 5}}>
                    {tooltipText}
                </span>}
                <BsPlusCircleFill />
              </div>
                </div>
                <ul>
                  {user?.accounts?.map((account, index) => (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", widows: "100%"}} key={index}>
                      <li>
                        {account.accountName} - {account.bankName} ({account.accountNumber})
                      </li>
                      <BsTrashFill 
                        className='delete-icon'  
                        onClick={()=>{
                          openDeleteAccount()
                          setAccountId(account.id)
                      }}/>
                    </div>
                  ))}
                </ul>
              </div>
              <div 
                className='edit-pencil-wrap edit-pencil-desktop'
                onClick={openAccount}
                onMouseEnter={() => { 
                  showTooltip("account")
                }}
                onMouseLeave={() => setShowTitle(false)}
                onTouchStart={() => { 
                  showTooltip("account")
                }}
                onTouchEnd={() => setShowTitle(false)}
              >
                {(showTitle && tooltipText === "Add new account") && <span style={{position: "absolute", right: 40, width: "max-content", marginRight: 5}}>
                    {tooltipText}
                </span>}
                <BsPlusCircleFill />
              </div>
            </div>

            {/* <div className="detail-item">
              <label htmlFor="currency">Currency:</label>
              <div className="image-select-input">
                <select>
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div> */}

            {/* <div className="bal-text-select-wrap">
                <GeneralDropdown
                  items={currenciesList}
                  setSelectedItem={handleCurrencyChange} 
                  handleOpenList={handleOpenList} 
                  openList={openList}
                  itemName={selectedCurrency}
                />

               </div> */}

            <div className="detail-item">
              <span>Referral link: {appBaseUrl}/register?referral=${user.userMemo}</span>
              <FaCopy className='copy-icon' onClick={handleCopyMemo} size={20}/>
            </div>

            {/* <div className="detail-item">
              <label htmlFor="currency">Theme:</label>
              <div className="image-select-input">
                <select>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div> */}

            {/* <div className="detail-item">
              <label htmlFor="currency">Language:</label>
              <div className="image-select-input">
                <select>
                  <option value="English">English</option>
                  <option value="Hausa">Hausa</option>
                  <option value="Igbo">Igbo</option>
                  <option value="Yoruba">Yoruba</option>
                </select>
              </div>
            </div> */}

          </div>
        {openAccountModal && 
        <AddAccount 
          isOpen={openAccountModal} 
          onClose={closeAccount}/>
        }
        
        {openPasswordModal && 
        <PasswordReset 
          isOpen={openPasswordModal} 
          onClose={closePassword}
          propsEmail={user.email}
        />}

        {openDeleteAcc && 
        <ConfirmModal 
          isOpen={openPasswordModal} 
          onClose={closeDeleteAccount} 
          func={deleteAcc}
          loading={loading}
        />}
    </div>
  );
};
