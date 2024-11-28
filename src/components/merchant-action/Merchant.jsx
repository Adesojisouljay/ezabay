import React, { useEffect, useState } from 'react';
import { getAllMerchants, approveMerchant, disapproveMerchant, updateMerchant, deleteMerchant } from '../../api/ekzat';
import './merchant.scss';

export const MerchantAction = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const result = await getAllMerchants();
        if (result.success) {
          setMerchants(result.data);
        } else {
          setError(result.message || 'Error fetching merchants');
        }
      } catch (err) {
        setError('Error fetching merchants');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  const handleApprove = async (id) => {
    try {
      const result = await approveMerchant(id);
      if (result.success) {
        setMerchants((prevMerchants) => 
          prevMerchants.map((merchant) =>
            merchant._id === id ? { ...merchant, status: 'approved', isActive: true } : merchant
          )
        );
      } else {
        setError(result.message || 'Error approving merchant');
      }
    } catch (err) {
      setError('Error approving merchant');
    }
  };

  const handleDisapprove = async (id) => {
    try {
      const result = await disapproveMerchant(id);
      if (result.success) {
        setMerchants((prevMerchants) => 
          prevMerchants.map((merchant) =>
            merchant._id === id ? { ...merchant, status: 'disapproved', isActive: false } : merchant
          )
        );
      } else {
        setError(result.message || 'Error disapproving merchant');
      }
    } catch (err) {
      setError('Error disapproving merchant');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const result = await updateMerchant(id, updatedData);
      if (result.success) {
        setMerchants((prevMerchants) => 
          prevMerchants.map((merchant) =>
            merchant._id === id ? { ...merchant, ...updatedData } : merchant
          )
        );
      } else {
        setError(result.message || 'Error updating merchant');
      }
    } catch (err) {
      setError('Error updating merchant');
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteMerchant(id);
      if (result.success) {
        setMerchants((prevMerchants) => 
          prevMerchants.filter((merchant) => merchant._id !== id)
        );
      } else {
        setError(result.message || 'Error deleting merchant');
      }
    } catch (err) {
      setError('Error deleting merchant');
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseImages = () => {
    setSelectedImage(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'disapproved':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'gray';
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="merchant-container">
      <h1>Merchants List</h1>
      <ul>
        {merchants.map((merchant) => (
          <li key={merchant._id} className="merchant-item">
            <div className="merchant-info">
              <p><strong>Username:</strong> {merchant.username}</p>
              <p><strong>Email:</strong> {merchant?.userId?.email || 'No user associated'}</p>
              <p><strong>Account Number:</strong> {merchant.accountNumber}</p>
              <p><strong>Account Name:</strong> {merchant.accountName}</p>
              <p><strong>Bank Name:</strong> {merchant.bankName}</p>
              <p><strong>Residential Address:</strong> {merchant.residentialAddress}</p>
              <p><strong>NIN:</strong> {merchant.NIN}</p>
              <p><strong>BVN:</strong> {merchant.BVN}</p>
              <p><strong>Social Media Handle:</strong> {merchant.socialMediaHandle}</p>
              <p
                style={{ color: getStatusColor(merchant.status) }}
              >
                <strong>Status:</strong> {merchant.status}
              </p>
              <p><strong>Active:</strong> {merchant.isActive ? 'Yes' : 'No'}</p>
              <div className="merchant-actions">
                <button className="approve" onClick={() => handleApprove(merchant._id)}>Approve</button>
                <button className="disapprove" onClick={() => handleDisapprove(merchant._id)}>Disapprove</button>
                {/* <button className="update" onClick={() => handleUpdate(merchant._id, { username: 'Updated username' })}>Update</button> */}
                <button className="delete" onClick={() => handleDelete(merchant._id)}>Delete</button>
              </div>
            </div>
            <div className="merchant-images">
              <img
                src={merchant.residencePicture}
                alt="merchant-pic"
                onClick={() => handleImageClick('https://via.placeholder.com/100')}
              />
              <img
                src={merchant.selfiePhotograph}
                alt="merchant-doc"
                onClick={() => handleImageClick('https://via.placeholder.com/100')}
              />
            </div>
          </li>
        ))}
      </ul>

      {selectedImage && (
        <div className="merchant-image-wrap" onClick={handleCloseImages}>
          <img src={selectedImage} alt="Selected" className="m-image" />
        </div>
      )}
    </div>
  );
};
