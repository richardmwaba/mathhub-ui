import { any } from 'prop-types';
import React, { createContext, useMemo, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [authentication, setAuthentication] = useState({});

    const authContext = useMemo(() => ({ authentication, setAuthentication }), [authentication]);
    return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: any,
};

export default AuthContext;
