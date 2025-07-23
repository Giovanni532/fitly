import { Card, CardContent } from '@/components/ui/card';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text } from 'react-native';

export function EmptyState() {
    return (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 items-center">
                <Ionicons name="search" size={48} color="#9CA3AF" />
                <Text className="text-gray-600 dark:text-gray-400 text-center mt-4">
                    Aucun défi ne correspond à vos critères
                </Text>
                <Text className="text-gray-500 dark:text-gray-500 text-center text-sm">
                    Essayez de modifier vos filtres
                </Text>
            </CardContent>
        </Card>
    );
} 