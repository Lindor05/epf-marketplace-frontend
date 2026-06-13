import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; }
    catch { return null; }
});
const [token, setToken] = useState(localStorage.getItem('token') || null);
const [loading, setLoading] = useState(true);

const logoutClean = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
};

const refreshUser = async () => {
    const res = await api.get('/auth/me');
    const u = res.data.user ?? res.data;
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    return u;
};

useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    refreshUser()
        .catch(() => logoutClean())
        .finally(() => setLoading(false));
    } else {
    setLoading(false);
    }
}, []);

const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t);
    setUser(u);
    return u;
};

const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    logoutClean();
};

if (loading) {
    return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='text-gray-400 text-sm'>Chargement...</div>
    </div>
    );
}

return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
    {children}
    </AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);

