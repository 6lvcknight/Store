import useAuthStore from '../store/auth';
import axios from './axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const login = async (email, password) => {
    try {
        const response = await axios.post('user/token/', 
            { email, password },
        );
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
    cookies.remove('access_token', {path: '/'});
    cookies.remove('refresh_token', {path: '/'});
    useAuthStore.getState().setUser(null);
}

export const setUser = async () => {
    const access_token = cookies.get('access_token');
    const refresh_token = cookies.get('refresh_token');

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
    cookies.set('access_token', access_token, { path: '/', maxAge: 86400, secure: true });
    cookies.set('refresh_token', refresh_token, { path: '/', maxAge: 604800, secure: true });

    const user = jwtDecode(access_token) ?? null;


    // If user information is present, update user state; otherwise, set loading state to false
    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
}

export const getRefreshToken = async () => {
    const refresh_token = cookies.get('refresh_token');
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
    