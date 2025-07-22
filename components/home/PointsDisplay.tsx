import { Card, CardContent } from '@/components/ui/card';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface PointsDisplayProps {
    totalPoints: number;
    activitiesCount: number;
    challengesCompleted: number;
}

export function PointsDisplay({ totalPoints, activitiesCount, challengesCompleted }: PointsDisplayProps) {
    return (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-2xl shadow-lg">
            <CardContent className="p-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-white text-lg font-bold mb-1">
                            Points du jour
                        </Text>
                        <View className="flex-row items-center space-x-4">
                            <View className="flex-row items-center">
                                <Ionicons name="fitness-outline" size={16} color="white" />
                                <Text className="text-white font-medium text-sm ml-1">
                                    {activitiesCount} activité{activitiesCount > 1 ? 's' : ''}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="trophy-outline" size={16} color="white" />
                                <Text className="text-white font-medium text-sm ml-1">
                                    {challengesCompleted} défi{challengesCompleted > 1 ? 's' : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-full">
                        <Ionicons name="star" size={20} color="white" />
                        <Text className="text-white font-bold text-xl ml-2">
                            {totalPoints}
                        </Text>
                    </View>
                </View>
            </CardContent>
        </Card>
    );
} 