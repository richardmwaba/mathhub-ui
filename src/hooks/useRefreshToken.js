import axios from 'src/api/axios';
import useAuthentication from './useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

const headers = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
};

const useRefreshToken = () => {
    const { setAuthentication } = useAuthentication();
    const navigate = useNavigate();
    const location = useLocation();

    return async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken !== null || refreshToken !== undefined) {
                const response = await axios.post(
                    '/auth/refresh',
                    { refreshToken: refreshToken },
                    headers,
                );
                setAuthentication((prev) => {
                    return {
                        ...prev,
                        username: response.data.username,
                        roles: response.data.roles,
                        accessToken: response.data.accessToken,
                    };
                });

                return response.data.accessToken;
            }
        } catch (error) {
            if (error?.response?.status === 403) {
                console.info('New sign in request required due to expired login.');
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
    };
};

export default useRefreshToken;
