import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('userToken');
        return token ? { username: 'admin', token } : null; 
    }); 
    const navigate = useNavigate();

    const ADMIN_USER = 'admin'; 
    const ADMIN_PASS = '12345'; 

    const login = async (username, password) => {
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            const simulatedToken = 'fake-admin-token-12345';
            setUser({ username, token: simulatedToken });
            localStorage.setItem('userToken', simulatedToken); 
            navigate('/admin');
            return true;
        } else {
            console.error("Erro de autenticação: Credenciais inválidas.");
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userToken'); 
        navigate('/login');
    };
    
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
