import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuthentication from 'src/hooks/useAuth';

export const isAuthenticated = (authentication) => {
    return authentication?.username;
};

export const userHasAllowedRole = (authentication, allowedRoles) => {
    return authentication?.roles?.find((role) => allowedRoles?.includes(role));
};

const RequireAuthentication = () => {
    const { authentication } = useAuthentication();
    const location = useLocation();

    return isAuthenticated(authentication) ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuthentication;
