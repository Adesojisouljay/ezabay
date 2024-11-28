import {api} from './axiosInstance';
const authToken = localStorage.getItem('token')

export const createHiveAccount = async (hiveAccountData) => {
  
    try {
      const config = {
        headers: {Authorization: `${authToken}`}
      };
      const response = await api.post('/hive//create-hive-account', hiveAccountData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating Hive account:', error);
      throw error.response?.data || { message: 'Error creating Hive account' };
    }
  };

  export const getAccountKeys = async (username) => {
      try {
        const response = await api.post('/hive//get-account-keys', {username});
        return response.data;
      } catch (error) {
        console.error('Error creating Hive account:', error);
        throw error.response?.data || { message: 'Error creating Hive account' };
      }
    };
  
