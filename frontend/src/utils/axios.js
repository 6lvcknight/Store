import axios from 'axios';
import { BASE_URL } from './constants';

// Create Axios instance with CSRF token support
const APIinstance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000, // timeout after 100 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});

export default APIinstance;
