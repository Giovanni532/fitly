import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { themes } from '../lib/theme';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    activeTheme: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'fitly_theme';

export function ThemeProvider({
    children,
    defaultTheme = 'system'
}: {
    children: React.ReactNode;
    defaultTheme?: 'light' | 'dark' | 'system';
}) {
    const systemColorScheme = useNativeColorScheme() as ThemeType || 'light';
    const [theme, setTheme] = useState<ThemeType>(
        defaultTheme === 'system' ? systemColorScheme : defaultTheme as ThemeType
    );
    const [isLoading, setIsLoading] = useState(true);
    const { setColorScheme } = useNativewindColorScheme();

    // Charger le thème sauvegardé au démarrage
    useEffect(() => {
        const loadSavedTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    setTheme(savedTheme as ThemeType);
                } else if (defaultTheme === 'system') {
                    setTheme(systemColorScheme);
                }
            } catch (error) {
                console.error('Erreur lors du chargement du thème:', error);
                if (defaultTheme === 'system') {
                    setTheme(systemColorScheme);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedTheme();
    }, [defaultTheme, systemColorScheme]);

    // Sauvegarder le thème quand il change
    const handleSetTheme = async (newTheme: ThemeType) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
            setTheme(newTheme);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du thème:', error);
            setTheme(newTheme);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            setColorScheme(theme);
        }
    }, [theme, setColorScheme, isLoading]);

    const activeTheme = themes[theme];

    if (isLoading) {
        // Retourner un état de chargement ou le thème par défaut
        return (
            <ThemeContext.Provider value={{
                theme: defaultTheme === 'system' ? systemColorScheme : (defaultTheme as ThemeType),
                setTheme: handleSetTheme,
                activeTheme: themes[defaultTheme === 'system' ? systemColorScheme : (defaultTheme as ThemeType)]
            }}>
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, activeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}