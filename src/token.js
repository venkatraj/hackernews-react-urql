const AUTH_TOKEN = 'auth-token';

const getToken = () => localStorage.getItem(AUTH_TOKEN);
const setToken = (token) => localStorage.setItem(AUTH_TOKEN, token);
const deleteToken = () => localStorage.removeItem(AUTH_TOKEN);

export { getToken, setToken, deleteToken };
