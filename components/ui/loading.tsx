import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface LoadingProps {
    message?: string;
}

export function Loading({ message = 'Chargement...' }: LoadingProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation d'entrée
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Animation de rotation continue
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [
                        { scale: scaleAnim },
                        { rotate: spin }
                    ]
                }}
                className="items-center"
            >
                {/* Cercle de chargement personnalisé */}
                <View className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-gray-700 items-center justify-center mb-6">
                    <View className="w-8 h-8 rounded-full border-4 border-transparent border-t-blue-500" />
                </View>

                <Text className="text-gray-700 dark:text-gray-200 text-lg font-medium text-center">
                    {message}
                </Text>

                <Text className="text-gray-500 dark:text-gray-400 text-sm text-center mt-2">
                    Veuillez patienter...
                </Text>
            </Animated.View>
        </View>
    );
} 