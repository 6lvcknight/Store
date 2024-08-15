import axios from 'axios';
import { isAccessTokenExpired, setAuthUser, getRefreshToken } from './auth';
import Cookies from 'js-cookie';
import { BASE_URL } from './constants';

const useAxios = async () => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    const instance = axios.create({
        baseURL: BASE_URL,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    });

    instance.interceptors.request.use(
        async (config) => {
            if (!isAccessTokenExpired(access_token)) {
                return config;
            }
            const response = await getRefreshToken(refresh_token);
        setAuthUser(response.access, response.refresh);

        config.headers.Authorization = `Bearer ${response.data.access}`;
        return config;
    });

    return instance;
}

export default useAxios;