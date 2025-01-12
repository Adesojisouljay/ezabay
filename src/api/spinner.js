import { api } from "./axiosInstance";

const authToken = localStorage.getItem("token");

export const spinTheWheel = async () => {
  try {

    const response = await api.post(
      "/spinner/spin",
      {},
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Spin Wheel Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || "Something went wrong" };
  }
};

export const claimSpinReward = async () => {
    try {
      const response = await api.post(`/spinner/claim-spin-reward`,
        {},
        { headers: {
             Authorization: authToken 
            } 
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error claiming spin reward:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Failed to claim reward." };
    }
  };