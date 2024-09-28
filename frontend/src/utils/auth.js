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

    // If access token is expired, try to refresh it
    if (isAccessTokenExpired(access_token)) {
        try {
            const response = await getRefreshToken(refresh_token);
            setAuthUser(response.access, response.refresh);
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
        }
    } else {
        setAuthUser(access_token, refresh_token);
    }
};

export const setAuthUser = (access_token, refresh_token) => {
    Cookies.set('access_token', access_token, {
        expires: 1,  // Access token expires in 1 day
        secure: true,
    });
    Cookies.set('refresh_token', refresh_token, {
        expires: 7,  // Refresh token expires in 7 days
        secure: true,
    });

    const user = jwtDecode(access_token) ?? null;

    // If user information is present, update user state; otherwise, set loading state to false
    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
}

export const getRefreshToken = async () => {
    const refresh_token = Cookies.get('refresh_token');
    const response = await axios.post('user/token/refresh/', {
        refresh: refresh_token,
    });

    return response.data;
}

export const isAccessTokenExpired = (access_token) => {
    try {
        const decoded = jwtDecode(access_token);
        return decoded.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
}
    