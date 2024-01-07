import { useContext } from 'react';
import AuthContext from 'src/authentication/AuthProvider';

const useAuthentication = () => {
    return useContext(AuthContext);
};

export default useAuthentication;
