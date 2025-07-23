import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type ChallengeType = 'all' | 'cardio' | 'muscu' | 'souplesse' | 'equilibre';
type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

interface ChallengeFiltersProps {
    selectedType: ChallengeType;
    selectedDifficulty: Difficulty;
    onTypeChange: (type: ChallengeType) => void;
    onDifficultyChange: (difficulty: Difficulty) => void;
}

export function ChallengeFilters({
    selectedType,
    selectedDifficulty,
    onTypeChange,
    onDifficultyChange
}: ChallengeFiltersProps) {
    const challengeTypes = [
        { id: 'all', label: 'Tous', icon: 'grid' },
        { id: 'cardio', label: 'Cardio', icon: 'heart' },
        { id: 'muscu', label: 'Muscu', icon: 'fitness' },
        { id: 'souplesse', label: 'Souplesse', icon: 'body' },
        { id: 'equilibre', label: 'Équilibre', icon: 'balance-scale' }
    ];

    const difficulties = [
        { id: 'all', label: 'Toutes', color: 'gray' },
        { id: 'easy', label: 'Facile', color: 'green' },
        { id: 'medium', label: 'Moyen', color: 'yellow' },
        { id: 'hard', label: 'Difficile', color: 'red' }
    ];

    return (
        <View>
            {/* Filtres par type */}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Type de défi
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {challengeTypes.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            onPress={() => onTypeChange(type.id as ChallengeType)}
                            className={`mr-3 px-4 py-2 rounded-full border ${selectedType === type.id
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={type.icon as any}
                                    size={16}
                                    color={selectedType === type.id ? 'white' : '#6B7280'}
                                    style={{ marginRight: 6 }}
                                />
                                <Text
                                    className={`font-medium ${selectedType === type.id
                                            ? 'text-white'
                                            : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {type.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Filtres par difficulté */}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Difficulté
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {difficulties.map((difficulty) => (
                        <TouchableOpacity
                            key={difficulty.id}
                            onPress={() => onDifficultyChange(difficulty.id as Difficulty)}
                            className={`mr-3 px-4 py-2 rounded-full border ${selectedDifficulty === difficulty.id
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <Text
                                className={`font-medium ${selectedDifficulty === difficulty.id
                                        ? 'text-white'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {difficulty.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
} 