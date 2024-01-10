import { CSpinner } from '@coreui/react-pro';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuthentication from 'src/hooks/useAuth';
import useRefreshToken from 'src/hooks/useRefreshToken';

const PersistAuthentication = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { authentication, persist } = useAuthentication();
    const refresh = useRefreshToken();

    // Persist login by fetching auth details using refresh token
    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        !authentication?.accesToken ? verifyRefreshToken() : setIsLoading(false);
    }, [authentication?.accesToken, refresh]);

    return isLoading ? (
        <div className="d-flex justify-content-center">
            <CSpinner />
        </div>
    ) : (
        <Outlet />
    );
};

export default PersistAuthentication;
