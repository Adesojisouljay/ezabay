import { api } from './axiosInstance';

export const initiateDeposit = async (depositData) => {
  try {
    const authToken = localStorage.getItem('token');

    const response = await api.post('/deposits', depositData, {
      headers: {
        Authorization: `${authToken}`,
      },
    });
    if (response.data.success) {
      console.log('Deposit request initiated successfully');
    } else {
      console.error('Failed to initiate deposit request:', response.data.error);
    }
    return response;
  } catch (error) {
    console.error('Error initiating deposit request:', error);
  }
};
