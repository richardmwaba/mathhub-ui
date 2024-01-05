import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuthentication from 'src/hooks/useAuth';

export const isAuthenticated = (user) => {
    return user?.username;
};

export const userHasAllowedRole = (user, allowedRoles) => {
    return user?.roles?.find((role) => allowedRoles?.includes(role));
};

const RequireAuthentication = () => {
    const { currentUser } = useAuthentication();
    const location = useLocation();

    return isAuthenticated(currentUser) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuthentication;
