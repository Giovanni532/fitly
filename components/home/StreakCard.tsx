import { Card, CardContent } from '@/components/ui/card';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface StreakCardProps {
    streak: number;
    totalPoints: number;
}

export function StreakCard({ streak, totalPoints }: StreakCardProps) {
    const getStreakColor = () => {
        if (streak >= 7) return 'from-red-600 to-orange-600';
        if (streak >= 5) return 'from-orange-600 to-yellow-600';
        if (streak >= 3) return 'from-green-600 to-emerald-600';
        return 'from-blue-600 to-indigo-600';
    };

    const getStreakMessage = () => {
        if (streak >= 7) return '🔥 Incroyable !';
        if (streak >= 5) return '🔥 Excellent !';
        if (streak >= 3) return '🔥 Bien joué !';
        if (streak >= 1) return '💪 Continue !';
        return '🚀 Commence ta série !';
    };

    return (
        <Card className={`bg-gradient-to-r ${getStreakColor()} border-0 rounded-2xl shadow-lg`}>
            <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-white text-lg font-bold mb-1">
                            {getStreakMessage()}
                        </Text>
                        <Text className="text-white font-medium text-sm">
                            {streak} jour{streak > 1 ? 's' : ''} d'affilée
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="flame" size={24} color="white" />
                        <Text className="text-white font-bold text-xl ml-1">
                            {streak}
                        </Text>
                    </View>
                </View>

                {/* Barre de progression */}
                <View className="mt-3">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-white font-medium text-xs">Progression</Text>
                        <Text className="text-white font-medium text-xs">{totalPoints} points</Text>
                    </View>
                    <View className="w-full bg-white/20 rounded-full h-2">
                        <View
                            className="bg-white rounded-full h-2"
                            style={{ width: `${Math.min((totalPoints / 100) * 100, 100)}%` }}
                        />
                    </View>
                </View>
            </CardContent>
        </Card>
    );
} 