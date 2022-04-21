import axios from '../../utils/axios';

export const getPlans = async () => {
  try {
    const response = await axios.get(`/plan/GetPlans`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

