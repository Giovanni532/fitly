import React, { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, Text, View } from 'react-native';

export function AuthLoading() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation de fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Animation de scale
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
        }).start();

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
        <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <View className="flex-1 justify-center items-center">
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
                    {/* Logo animé */}
                    <View className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl items-center justify-center mb-6 shadow-lg">
                        <Text className="text-white text-4xl font-bold">F</Text>
                    </View>

                    {/* Texte de chargement */}
                    <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Fitly
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-center">
                        Chargement...
                    </Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
} 