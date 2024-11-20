import { api } from './axiosInstance';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);

    if (response?.data?.success) {
      return response?.data;
    } else {
      console.error('Failed to register user:', response?.data.message);
      return {
        success: false,
        message: response?.data.message,
      };
    }
  } catch (error) {
    console.error('Error registering user:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'An unexpected error occurred',
    };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);

      localStorage.setItem('token', response?.data.token);
      return response; 
 
  } catch (error) {
    console.error('Error logging in:', error);
    return error
  }
};
