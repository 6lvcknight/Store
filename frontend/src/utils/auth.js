import useAuthStore from '../store/auth';
import axios from './axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export const login = async (email, password) => {
    try {
        const response = await axios.post('user/token/', { email, password });
        console.log('Response:', response)
        const { data, status } = response;

        if (status === 200){
            setAuthUser(data.access, data.refresh);
        }
        return {data, error: null}
    } catch (error){
        console.error('Login error:', error);
        return {
            data: null,
            error: error.response?.data?.detail || 'An error occurred'
        }
    }
}

export const register = async (full_name, email, phone, username, password, password2) => {
    try {
        const { data, status } = await axios.post('user/register/', {
            full_name, email, phone, username, password, password2
        });

        await login(email, password);

        if (status === 201){
            setAuthUser(data.access, data.refresh);
        }
        return {data, error: null}
    } catch (error){
        return {
            data: null,
            error: error.response?.data?.detail || 'An error occurred'
        }
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

    if (!access_token && !refresh_token) {
        logout();
    }

    if (isAccessTokenExpired(access_token)) {
        try {
            const access_token = await getRefreshToken();
            setAuthUser(response.access, response.refresh);
        } catch(error) {
            logout();
        }
    } else {
        setAuthUser(access_token, refresh_token);
    }
}

export const setAuthUser = (access_token, refresh_token) => {
    Cookies.set('access_token', access_token, {
        expires: 1,
        secure: true
    });
    Cookies.set('refresh_token', refresh_token, {
        expires: 7,
        secure: true
    });

    const decoded = jwtDecode(access_token) ?? null;
    if (decoded) {
        useAuthStore.getState().setUser(decoded);
    }
    useAuthStore.getState().setLoading(false);
}

export const getRefreshToken = async () => {
    const refresh_token = Cookies.get('refresh_token');
    const response = await axios.post('user/token/refresh/', {
        refresh: refresh_token
    });

    return response.data.access;
}

export const isAccessTokenExpired = (access_token) => {
    try {
        const decoded = jwtDecode(access_token);
        return decoded.exp < Date.now() / 100;
    } catch (error) {
        console.log(error);
        return true;
    }
}
    