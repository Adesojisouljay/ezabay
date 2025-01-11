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
