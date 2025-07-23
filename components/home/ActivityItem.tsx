import { Activity } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface ActivityItemProps {
    activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
    const getIntensityIcon = () => {
        switch (activity.intensity) {
            case 'light':
                return { name: 'leaf-outline' as const, color: '#10B981' };
            case 'moderate':
                return { name: 'flame-outline' as const, color: '#F59E0B' };
            case 'intense':
                return { name: 'flash-outline' as const, color: '#EF4444' };
            default:
                return { name: 'leaf-outline' as const, color: '#10B981' };
        }
    };

    const getIntensityText = () => {
        switch (activity.intensity) {
            case 'light':
                return 'léger';
            case 'moderate':
                return 'modéré';
            case 'intense':
                return 'intense';
            default:
                return 'léger';
        }
    };

    const intensity = getIntensityIcon();

    return (
        <View className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-4 border border-gray-100 dark:border-gray-600">
            <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                    <Ionicons name="fitness-outline" size={24} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
                        {activity.name}
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-black dark:text-white text-sm font-medium">
                            {activity.duration}
                        </Text>
                        <Text className="text-gray-400 dark:text-gray-500 mx-2">•</Text>
                        <Ionicons name={intensity.name} size={16} color={intensity.color} />
                        <Text className="text-black dark:text-white text-sm font-medium ml-1">
                            {getIntensityText()}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="flex-row items-center bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-full">
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text className="text-black dark:text-white font-bold ml-1">
                    {activity.points}
                </Text>
            </View>
        </View>
    );
} 