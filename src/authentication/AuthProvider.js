import { any } from 'prop-types';
import React, { createContext, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [authentication, setAuthentication] = useState({});

    return (
        <AuthContext.Provider value={{ authentication, setAuthentication }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: any,
};

export default AuthContext;
