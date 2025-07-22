import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';

interface User {
    id: string;
    email: string | null;
    displayName?: string | null;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, userData?: { firstName?: string; lastName?: string }) => Promise<{ success: boolean; error?: string }>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    updateUserProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Écouter les changements d'état d'authentification Firebase
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Utilisateur connecté
                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    firstName: firebaseUser.displayName?.split(' ')[0],
                    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ')
                });
            } else {
                // Utilisateur déconnecté
                setUser(null);
            }
            setIsLoading(false);
        });

        // Nettoyer l'écouteur lors du démontage
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: any) {
            let errorMessage = 'Une erreur est survenue lors de la connexion';

            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Aucun utilisateur trouvé avec cet email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Mot de passe incorrect';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email invalide';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Trop de tentatives. Réessayez plus tard';
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }

            return { success: false, error: errorMessage };
        }
    };

    const signup = async (email: string, password: string, userData?: { firstName?: string; lastName?: string }): Promise<{ success: boolean; error?: string }> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Mettre à jour le profil utilisateur avec le nom complet
            if (userData?.firstName || userData?.lastName) {
                const displayName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
                await updateProfile(userCredential.user, {
                    displayName: displayName
                });
            }

            return { success: true };
        } catch (error: any) {
            let errorMessage = 'Une erreur est survenue lors de l\'inscription';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Cet email est déjà utilisé';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email invalide';
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }

            return { success: false, error: errorMessage };
        }
    };

    const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
        try {
            // Pour l'instant, on simule l'authentification Google
            // TODO: Implémenter l'authentification Google complète
            return { success: false, error: 'Authentification Google à implémenter' };
        } catch (error: any) {
            return { success: false, error: 'Erreur lors de la connexion Google' };
        }
    };

    const updateUserProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                return { success: false, error: 'Aucun utilisateur connecté' };
            }

            // Mettre à jour le profil Firebase
            if (data.firstName || data.lastName) {
                const displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
                await updateProfile(currentUser, {
                    displayName: displayName
                });
            }

            // Mettre à jour l'état local
            setUser(prev => prev ? { ...prev, ...data } : null);

            return { success: true };
        } catch (error: any) {
            return { success: false, error: 'Erreur lors de la mise à jour du profil' };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, signup, signInWithGoogle, updateUserProfile }}>
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