import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../util/firebase'; 

const AuthContext = createContext();

function AuthProvider({ children }) {
    const navigate = useNavigate();
    
    const [user, setUser] = useState({
        user: null,
        isAuthenticated: false,
        token: null,
    });

    useEffect(() => {
        // Set up an authentication state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(!user) {
                setUser({
                    user: null,
                    isAuthenticated: false,
                    token: null
                });
                return;
            }
            user.getIdToken().then((token) => {
                setUser({
                    user: user,
                    isAuthenticated: true,
                    token: token
                });
            });
        });
        // Clean up the listener on unmount
        return unsubscribe;
    }, []);

    // Use useCallback to memoize the functions to prevent unnecessary re-renders

    const login = useCallback((email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }, []);

    const logout = useCallback(() => {
        return signOut(auth);
    }, []);

    const register = useCallback((email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }, []);

    const resetPassword = useCallback((email) => {
        return sendPasswordResetEmail(auth, email);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const memoizedValue = useMemo(() => ({ user, login, logout, register, resetPassword }), [user]);

    return (
        <AuthContext.Provider value={memoizedValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export { AuthContext };