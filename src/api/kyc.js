import { api } from './axiosInstance';

const authToken = localStorage.getItem('token');

export const submitKYC = async (kycData) => {
  try {
    const response = await api.post(
      '/kyc/submit',
      kycData,
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      console.log('KYC submitted successfully:');
    } else {
      console.error('KYC submission failed:');
    }
  } catch (error) {
    console.error('Error submitting KYC:', error.message);
  }
};

export const approveKYC = async (kycId) => {
  try {
    const response = await api.post(
      `/kyc/approve/${kycId}`,
      {},
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      console.log('KYC approved successfully:', response.data.message);
    } else {
      console.error('KYC approval failed:', response.data.message);
    }
  } catch (error) {
    console.error('Error approving KYC:', error.message);
  }
};

export const rejectKYC = async (kycId) => {
  try {
    const response = await api.post(
      `/kyc/reject/${kycId}`,
      {},
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      console.log('KYC rejected successfully:');
    } else {
      console.error('KYC rejection failed:');
    }
  } catch (error) {
    console.error('Error rejecting KYC:', error.message);
  }
};

export const getAllKYC = async () => {
  try {
    const response = await api.get('/kyc/all', {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      console.log('Fetched all KYC records:');
      return response.data.data;
    } else {
      console.error('Failed to fetch KYC records:');
      return [];
    }
  } catch (error) {
    console.error('Error fetching KYC records:', error.message);
    return [];
  }
};
