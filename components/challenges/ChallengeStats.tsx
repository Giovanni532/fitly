import { Card, CardContent } from '@/components/ui/card';
import { Challenge } from '@/lib/types';
import React from 'react';
import { Text, View } from 'react-native';

interface ChallengeStatsProps {
    challenges: Challenge[];
    filteredCount: number;
}

export function ChallengeStats({ challenges, filteredCount }: ChallengeStatsProps) {
    const completedCount = challenges.filter(c => c.completed).length;
    const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);

    return (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
                <View className="flex-row justify-between items-center">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {filteredCount}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-sm">
                            Défis trouvés
                        </Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {completedCount}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-sm">
                            Terminés
                        </Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {totalPoints}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-sm">
                            Points totaux
                        </Text>
                    </View>
                </View>
            </CardContent>
        </Card>
    );
} 