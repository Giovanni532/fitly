import { Card, CardContent } from '@/components/ui/card';
import { Challenge } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ChallengeCardProps {
    challenge: Challenge;
    onStart: (challengeId: string) => void;
    onComplete: (challengeId: string) => void;
}

export function ChallengeCard({ challenge, onStart, onComplete }: ChallengeCardProps) {
    return (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
            <CardContent className="p-6">
                <View className="flex-row items-start justify-between mb-6">
                    <View className="flex-1">
                        <Text className="text-gray-900 dark:text-white text-xl font-bold mb-2">
                            {challenge.name}
                        </Text>
                        {challenge.description && (
                            <Text className="text-gray-600 dark:text-gray-300 text-sm leading-5">
                                {challenge.description}
                            </Text>
                        )}
                    </View>
                    <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center ml-4">
                        <Ionicons name="trophy" size={24} color="white" />
                    </View>
                </View>

                <View className="flex-row items-center justify-between mb-8">
                    <View className="flex-row items-center">
                        <Ionicons name="star" size={18} color="#F59E0B" />
                        <Text className="text-black dark:text-white font-semibold ml-2 text-lg">
                            {challenge.points} points
                        </Text>
                    </View>
                    {challenge.completed && (
                        <View className="flex-row items-center bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text className="text-black dark:text-white font-semibold ml-1">Terminé</Text>
                        </View>
                    )}
                </View>

                <View className="flex-row space-x-4">
                    {!challenge.completed ? (
                        <>
                            <TouchableOpacity
                                onPress={() => onStart(challenge.id)}
                                className="flex-1 bg-blue-500 rounded-xl py-4 items-center shadow-sm mr-2"
                            >
                                <Text className="text-white font-semibold">Commencer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onComplete(challenge.id)}
                                className="flex-1 bg-green-500 rounded-xl py-4 items-center shadow-sm ml-2"
                            >
                                <Text className="text-white font-semibold">Terminer</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View className="flex-1 bg-green-500 rounded-xl py-4 items-center shadow-sm">
                            <Text className="text-white font-semibold">Défi accompli ! 🎉</Text>
                        </View>
                    )}
                </View>
            </CardContent>
        </Card>
    );
} 