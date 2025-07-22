import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavbarProps {
    activeTab: string;
    onTabPress: (tab: string) => void;
}

export function BottomNavbar({ activeTab, onTabPress }: BottomNavbarProps) {
    const tabs = [
        {
            id: 'home',
            label: 'Accueil',
            icon: (active: boolean) => (
                <Ionicons
                    name={active ? 'home' : 'home-outline'}
                    size={24}
                    color={active ? '#3B82F6' : '#6B7280'}
                />
            ),
        },
        {
            id: 'profile',
            label: 'Profil',
            icon: (active: boolean) => (
                <Ionicons
                    name={active ? 'person' : 'person-outline'}
                    size={24}
                    color={active ? '#3B82F6' : '#6B7280'}
                />
            ),
        },
    ];

    return (
        <View className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2" style={{ paddingBottom: Platform.OS === 'ios' ? 34 : 16 }}>
            <View className="flex-row justify-around items-center">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => onTabPress(tab.id)}
                            className={`flex-1 items-center py-2 px-4 rounded-xl ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                            activeOpacity={0.7}
                        >
                            <View className="items-center space-y-1">
                                {tab.icon(isActive)}
                                <Text
                                    className={`text-xs font-medium ${isActive
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {tab.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
} 