import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeUserDoc = () => { };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            // Unsubscribe from previous user listener if exists
            if (unsubscribeUserDoc) {
                unsubscribeUserDoc();
            }

            if (user) {
                // Subscribe to new user profile
                unsubscribeUserDoc = onSnapshot(doc(db, "users", user.uid), (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        setUserData(docSnapshot.data());
                    } else {
                        setUserData(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user profile:", error);
                    setLoading(false);
                });
            } else {
                setUserData(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUserDoc) {
                unsubscribeUserDoc();
            }
        };
    }, []);

    const value = {
        currentUser,
        userData,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
