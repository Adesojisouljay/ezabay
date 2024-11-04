import {api} from './axiosInstance';

export const createHiveAccount = async (hiveAccountData) => {
    try {
      const response = await api.post('/hive//create-hive-account', hiveAccountData);
      return response.data;
    } catch (error) {
      console.error('Error creating Hive account:', error);
      throw error.response?.data || { message: 'Error creating Hive account' };
    }
  };
  