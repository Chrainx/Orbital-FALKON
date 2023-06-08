import { useRouter, useSegments } from "expo-router";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        console.log(`useProtectedRoute useEffect called`);
        const inAuthGroup = segments[0] === "(auth)"
        if (!user && !inAuthGroup) {
            console.log(`inAuthGroup: ${inAuthGroup}`);
            router.replace("/login");
        } else if (user && inAuthGroup) {
            router.replace("/expense");
        }
    }, [user, segments, router]);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    useProtectedRoute(user);

    useEffect(() => {
        console.log(`AuthProvider useEffect called`);
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`onAuthStateChange event: ${event}`);
            if (event === "SIGNED_IN") {
                setUser(session.user);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        })
        return () => data.subscription.unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}