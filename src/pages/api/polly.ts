import axios from '../../utils/axios';
import { POLLY_URL } from '../../utils/constants';

export const generateRecording = async (payload) => {
  const settings = {
    method: "POST",
    body: JSON.stringify(payload)
  };
  try {
    const response = await fetch(POLLY_URL, settings)
    return response;
  } catch (error) {
    console.log(error);
  }
}