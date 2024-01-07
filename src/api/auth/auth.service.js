import axios from 'src/api/axios';

const headers = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
};

function register(username, email, password, roles) {
    return axios.post(
        '/auth/register',
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
            '/auth/login',
            {
                username,
                password,
            },
            headers,
        )
        .then((response) => {
            if (response?.data?.username) {
                localStorage.setItem('refresh_token', response.data.refreshToken);
            }

            return response.data;
        });
}

function logout() {
    localStorage.removeItem('refresh_token');
    return axios.post('/logout').then((response) => {
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
