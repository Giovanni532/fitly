import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CompletedToggleProps {
    showCompleted: boolean;
    onToggle: (show: boolean) => void;
}

export function CompletedToggle({ showCompleted, onToggle }: CompletedToggleProps) {
    return (
        <TouchableOpacity
            onPress={() => onToggle(!showCompleted)}
            className="flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
        >
            <View className="flex-row items-center">
                <Ionicons
                    name={showCompleted ? 'eye' : 'eye-off'}
                    size={20}
                    color="#6B7280"
                    style={{ marginRight: 12 }}
                />
                <Text className="text-gray-900 dark:text-white font-medium">
                    Afficher les défis terminés
                </Text>
            </View>
            <View className={`w-6 h-6 rounded-full border-2 ${showCompleted ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                {showCompleted && (
                    <Ionicons name="checkmark" size={16} color="white" />
                )}
            </View>
        </TouchableOpacity>
    );
} 