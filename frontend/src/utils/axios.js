import axios from 'axios';
import { BASE_URL } from './constants';

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 100000, // timeout after 5 seconds
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

export default instance;