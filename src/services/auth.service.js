import axios from 'axios';

const headers = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
};

function register(username, email, password, roles) {
    return axios.post(
        process.env.REACT_APP_LOCALHOST_API_URL + 'auth/register',
        {
            username,
            email,
            password,
            roles,
        },
        headers,
    );
}

function login(username, password) {
    return axios
        .post(
            process.env.REACT_APP_LOCALHOST_API_URL + 'auth/login',
            {
                username,
                password,
            },
            headers,
        )
        .then((response) => {
            if (response?.data?.username) {
                localStorage.setItem('refresh_token', JSON.stringify(response.data.refreshToken));
            }

            return response.data;
        });
}

function logout() {
    localStorage.removeItem('user');
    return axios.post(process.env.REACT_APP_LOCALHOST_API_URL + 'logout').then((response) => {
        return response.data;
    });
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
