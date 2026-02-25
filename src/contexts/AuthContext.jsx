import { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../mockData/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('municipalUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const foundUser = db.data.users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            // Don't store password in real app!
            const { password, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('municipalUser', JSON.stringify(userWithoutPassword));

            // Log audit
            db.data.auditLogs.push({ id: Date.now().toString(), action: 'LOGIN', userId: foundUser.id, timestamp: new Date().toISOString() });
            db.save();
            return userWithoutPassword;
        }
        return null;
    };

    const logout = () => {
        if (user) {
            db.data.auditLogs.push({ id: Date.now().toString(), action: 'LOGOUT', userId: user.id, timestamp: new Date().toISOString() });
            db.save();
        }
        setUser(null);
        localStorage.removeItem('municipalUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
