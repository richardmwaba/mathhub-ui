/* eslint-disable react-hooks/exhaustive-deps */
import { CSpinner } from '@coreui/react-pro';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuthentication from 'src/hooks/useAuth';
import useRefreshToken from 'src/hooks/useRefreshToken';

const PersistAuthentication = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { authentication } = useAuthentication();
    const refresh = useRefreshToken();

    // Persist login by fetching auth details using refresh token
    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                if (error?.response?.status !== 403) {
                    console.error(error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        !authentication?.accesToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);

    return isLoading ? (
        <div className="d-flex justify-content-center">
            <CSpinner variant="grow" />
        </div>
    ) : (
        <Outlet />
    );
};

export default PersistAuthentication;
