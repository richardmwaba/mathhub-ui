import React, { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuthentication from 'src/hooks/useAuth';
import useRefreshToken from 'src/hooks/useRefreshToken';

export const isAuthenticated = (authentication) => {
    return authentication?.accessToken;
};

export const userHasAllowedRole = (authentication, allowedRoles) => {
    return authentication?.roles?.find((role) => allowedRoles?.includes(role));
};

const RequireAuthentication = () => {
    const { authentication } = useAuthentication();
    const refresh = useRefreshToken();
    const location = useLocation();

    // Persist login by fetching auth details using refresh token
    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                const newAccessToken = await refresh();
                return newAccessToken;
            } catch (error) {
                console.error(error);
            }
        };

        if (!isAuthenticated(authentication)) {
            verifyRefreshToken();
            console.log(`Getting new token because old auth is : ${authentication?.accessToken}`);
        }
    }, [authentication, refresh]);

    return isAuthenticated(authentication) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuthentication;
