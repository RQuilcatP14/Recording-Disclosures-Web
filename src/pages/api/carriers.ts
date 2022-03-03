import axios from '../../utils/axios';

export const getCarriers = async () => {
  try {
    const response = await axios.get(`/carrier/GetCarriers`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const insertCarrierPlan = async (payload) => {
  try {
    const response = await axios.post(`/carrier/AddRecordingDisclosure`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}