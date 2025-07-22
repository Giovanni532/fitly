import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    signup: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté au démarrage
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Ici on pourrait vérifier un token stocké
            // Pour l'instant, on simule un délai
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            // Simulation de l'authentification
            if (username === 'Testuser' && password === '1234') {
                const user = { id: '1', username };
                setUser(user);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const signup = async (username: string, password: string): Promise<boolean> => {
        try {
            // Simulation de l'inscription
            const user = { id: Date.now().toString(), username };
            setUser(user);
            return true;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 