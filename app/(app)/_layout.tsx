import { BottomNavbar } from '@/components/navigation/BottomNavbar';
import { AuthLoading } from '@/components/ui/auth-loading';
import { useAuth } from '@/contexts/auth-context';
import React, { useState } from 'react';
import { View } from 'react-native';
import ChallengesPage from './challenges';
import HomePage from './home';
import ProfilePage from './profile';

export default function AppLayout() {
    const [activeTab, setActiveTab] = useState('home');
    const { isLoading } = useAuth();

    // Afficher l'écran de chargement pendant l'initialisation de l'auth
    if (isLoading) {
        return <AuthLoading />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage />;
            case 'challenges':
                return <ChallengesPage />;
            case 'profile':
                return <ProfilePage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <View className="flex-1">
            {renderContent()}
            <BottomNavbar activeTab={activeTab} onTabPress={setActiveTab} />
        </View>
    );
} 