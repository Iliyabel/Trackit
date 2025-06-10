import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../util/firebase'; 

const AuthContext = createContext();

function AuthProvider({ children }) {
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
            }).catch((error) => {
                console.error("Error getting token:", error);
            });
        });
        // Clean up the listener on unmount
        return unsubscribe;
    }, []);

    // Use useCallback to memoize the functions to prevent unnecessary re-renders

    const login = useCallback((email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                throw new Error(`Error ${error.code}: ${error.message}`);
            });
    }, []);

    const logout = useCallback(() => {
        return signOut(auth)
            .catch((error) => {
                throw new Error(`Error ${error.code}: ${error.message}`);
            });
    }, []);

    const register = useCallback((email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                throw new Error(`Error ${error.code}: ${error.message}`);
            });
    }, []);

    const resetPassword = useCallback((email) => {
        return sendPasswordResetEmail(auth, email)
            .catch((error) => {
                throw new Error(`Error ${error.code}: ${error.message}`);
            });
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