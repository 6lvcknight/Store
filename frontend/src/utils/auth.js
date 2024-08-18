import useAuthStore from '../store/auth';
import axios from './axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export const login = async (email, password) => {
    try {
        const response = await axios.post('user/token/', { email, password });
        console.log('Response:', response);
        const { data, status } = response;

        if (status === 200){
            setAuthUser(data.access, data.refresh);
        }
        return {data, error: null};
    } catch (error) {
        console.error('Login error:', error);
        return {
            data: null,
            error: error.response?.data?.detail || 'An error occurred'
        };
    }
}

export const register = async (email, username, full_name, phone, password, password2) => {
    try {
        const response = await axios.post('user/register/', { email, username, full_name, phone, password, password2 });
        console.log('Response:', response);
        const { data } = response;

        await login(email, password);
        
        return {data, error: null};
    } catch (error) {
        console.error('Registration error:', error);
        return {
            data: null,
            error: error.response?.data?.detail || 'An error occurred',
        };
    }
}

export const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    useAuthStore.getState().setUser(null);
}

export const setUser = async () => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    if (!access_token || !refresh_token) {
        return;
    }

    if (isAccessTokenExpired(access_token)) {
        try {
            const new_access_token = await getRefreshToken();
            setAuthUser(new_access_token, refresh_token);
        } catch(error) {
            logout();
        }
    } else {
        setAuthUser(access_token, refresh_token);
    }
}

export const setAuthUser = (access_token, refresh_token) => {
    Cookies.set('access_token', access_token, {
        expires: 1, // Access token expires in 1 day
        secure: true
    });
    Cookies.set('refresh_token', refresh_token, {
        expires: 7, // Refresh token expires in 7 days
        secure: true
    });

    let decoded = null;
    try {
        decoded = jwtDecode(access_token);
    } catch (error) {
        console.error('Failed to decode access token:', error);
        return;
    }

    if (decoded) {
        useAuthStore.getState().setUser(decoded);
    }
    useAuthStore.getState().setLoading(false);
}

export const getRefreshToken = async () => {
    const refresh_token = Cookies.get('refresh_token');
    try {
        const response = await axios.post('user/token/refresh/', {
            refresh: refresh_token,
        });
        return response.data.access;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error;
    }
}

export const isAccessTokenExpired = (access_token) => {
    try {
        const decoded = jwtDecode(access_token);
        return decoded.exp < Date.now() / 1000;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
}
    