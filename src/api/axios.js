import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_LOCALHOST_API_URL,
});
