import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // Remove the forced reload as it interferes with navigation
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/login'; // Use direct navigation for logout
    };

    // Sync logout across tabs/windows
    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === 'user' && !event.newValue) {
                setUser(null);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 