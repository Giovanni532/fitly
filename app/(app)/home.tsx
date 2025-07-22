import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function HomePage() {
    const { user } = useAuth();

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Fonction pour obtenir le nom d'affichage
    const getDisplayName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        } else if (user?.displayName) {
            return user.displayName;
        } else if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'Utilisateur';
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 space-y-6 pb-20">
                    {/* Header avec salutation */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                        className="items-center"
                    >
                        <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            Bonjour, {getDisplayName()} !
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300 text-center">
                            Bienvenue sur Fitly
                        </Text>
                    </Animated.View>

                    {/* Carte de bienvenue */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 rounded-2xl shadow-lg">
                            <CardContent className="p-6">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <Text className="text-white text-xl font-semibold mb-2">
                                            Commencez votre voyage
                                        </Text>
                                        <Text className="text-blue-100 text-sm">
                                            Votre application de fitness personnalisée
                                        </Text>
                                    </View>
                                    <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center">
                                        <Ionicons name="fitness-outline" size={30} color="white" />
                                    </View>
                                </View>
                            </CardContent>
                        </Card>
                    </Animated.View>

                    {/* Informations */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-2xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-gray-800 dark:text-white">
                                    À propos de Fitly
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <View className="flex-row items-center space-x-3">
                                    <View className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center">
                                        <Ionicons name="checkmark" size={16} color="#10B981" />
                                    </View>
                                    <Text className="text-gray-700 dark:text-gray-200">
                                        Authentification sécurisée
                                    </Text>
                                </View>
                                <View className="flex-row items-center space-x-3">
                                    <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center">
                                        <Ionicons name="shield-checkmark" size={16} color="#3B82F6" />
                                    </View>
                                    <Text className="text-gray-700 dark:text-gray-200">
                                        Navigation protégée
                                    </Text>
                                </View>
                                <View className="flex-row items-center space-x-3">
                                    <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full items-center justify-center">
                                        <Ionicons name="sparkles" size={16} color="#8B5CF6" />
                                    </View>
                                    <Text className="text-gray-700 dark:text-gray-200">
                                        Interface moderne et animée
                                    </Text>
                                </View>
                            </CardContent>
                        </Card>
                    </Animated.View>

                    {/* Version */}
                    <Animated.View
                        style={{ opacity: fadeAnim }}
                        className="items-center pt-4"
                    >
                        <Text className="text-gray-500 dark:text-gray-400 text-sm">
                            Fitly v1.0.0
                        </Text>
                    </Animated.View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 