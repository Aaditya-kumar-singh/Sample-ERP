import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('lbs_user')) || null; }
        catch { return null; }
    });

    const login = useCallback(async (email, password) => {
        const res = await api.post('/users/login', { email, password }, false);
        const { user: u, accessToken } = res.data;
        localStorage.setItem('lbs_access_token', accessToken);
        localStorage.setItem('lbs_user', JSON.stringify(u));
        setUser(u);
        return u;
    }, []);

    const logout = useCallback(() => {
        api.post('/users/logout', {}).catch(() => { });
        localStorage.removeItem('lbs_access_token');
        localStorage.removeItem('lbs_user');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
