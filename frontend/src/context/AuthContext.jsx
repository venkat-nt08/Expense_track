import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = parseJwt(token);
            if (decoded && decoded.sub) {
                setUser({ token, email: decoded.sub });
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/token', formData);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        const decoded = parseJwt(access_token);
        setUser({ token: access_token, email: decoded?.sub });
        return true;
    };

    const signup = async (email, password) => {
        await api.post('/signup', { email, password });
        return true;
    };

    const forgotPassword = async (email, newPassword) => {
        await api.post('/forgot-password', { email, new_password: newPassword });
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, forgotPassword, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
