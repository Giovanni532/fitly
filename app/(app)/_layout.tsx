import { BottomNavbar } from '@/components/navigation/BottomNavbar';
import React, { useState } from 'react';
import { View } from 'react-native';
import HomePage from './home';
import ProfilePage from './profile';

export default function AppLayout() {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage />;
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