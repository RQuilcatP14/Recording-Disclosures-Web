import axios from 'axios';
import {BASE_URL} from './constants';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  },
});

export default axiosClient;