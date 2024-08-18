import axios from 'axios';
import { isAccessTokenExpired, setAuthUser, getRefreshToken } from './auth';
import Cookies from 'js-cookie';
import { BASE_URL } from './constants';

const useAxios = async () => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${access_token}`
        }
    });

    instance.interceptors.request.use(
        async (req) => {
            if (!isAccessTokenExpired(access_token)) {
                return req;
            }
            const response = await getRefreshToken(refresh_token);
            setAuthUser(response.access, response.refresh);

            req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    });

    return instance;
}

export default useAxios;