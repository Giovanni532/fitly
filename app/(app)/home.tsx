import { ActivityItem } from '@/components/home/ActivityItem';
import { AddActivityModal } from '@/components/home/AddActivityModal';
import { ChallengeCard } from '@/components/home/ChallengeCard';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useHomeData } from '@/hooks/useHomeData';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomePage() {
    const { user } = useAuth();
    const {
        challenges,
        activities,
        stats,
        loading,
        startChallenge,
        completeChallenge,
        addActivity,
        getTodaysChallenge,
        resetDailyData,
        refreshData,
    } = useHomeData();

    const [showAddModal, setShowAddModal] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Vérifier si c'est un nouveau jour et mettre à jour les données
    useEffect(() => {
        const checkNewDay = async () => {
            try {
                const now = new Date();
                const today = now.toDateString();

                // Vérifier si on a déjà traité aujourd'hui
                const lastCheck = await AsyncStorage.getItem('lastDayCheck');

                if (lastCheck !== today) {
                    // C'est un nouveau jour, rafraîchir les données
                    console.log('Nouveau jour détecté, mise à jour des données...');
                    await refreshData();
                    await AsyncStorage.setItem('lastDayCheck', today);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification du nouveau jour:', error);
            }
        };

        // Vérifier immédiatement
        checkNewDay();

        // Écouter les changements d'état de l'app
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active') {
                // L'app devient active, vérifier si c'est un nouveau jour
                checkNewDay();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription?.remove();
        };
    }, [refreshData]);

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

    const todaysChallenge = getTodaysChallenge();

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center justify-center">
                    <View className="items-center">
                        <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-6">
                            <Ionicons name="fitness" size={40} color="white" />
                        </View>
                        <Text className="text-gray-800 text-xl font-bold">
                            Chargement...
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6 space-y-8 pb-24">
                    {/* Header avec salutation */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                        className="items-center mb-4"
                    >
                        <Text className="text-4xl font-bold text-gray-900 mb-3">
                            Bonjour, {getDisplayName()} !
                        </Text>
                        <Text className="text-gray-600 text-lg text-center">
                            Prêt pour une nouvelle journée ?
                        </Text>
                    </Animated.View>

                    {/* Stats en haut */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View className="flex-row space-x-4 mb-8">
                            {/* Points */}
                            <View className="flex-1 bg-blue-500 rounded-2xl p-4 shadow-lg mr-4">
                                <View className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="text-white text-sm font-medium opacity-90">
                                            Points du jour
                                        </Text>
                                        <Text className="text-white text-2xl font-bold">
                                            {stats.totalPoints}
                                        </Text>
                                    </View>
                                    <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                                        <Ionicons name="star" size={24} color="white" />
                                    </View>
                                </View>
                            </View>

                            {/* Streak */}
                            <View className="flex-1 bg-orange-500 rounded-2xl p-4 shadow-lg">
                                <View className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="text-white text-sm font-medium opacity-90">
                                            Streak
                                        </Text>
                                        <Text className="text-white text-2xl font-bold">
                                            {stats.streak}
                                        </Text>
                                    </View>
                                    <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                                        <Ionicons name="flame" size={24} color="white" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Défi du jour */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                        className="mb-8"
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-2xl font-bold text-gray-900">
                                Défi du jour 🎯
                            </Text>
                            <TouchableOpacity
                                onPress={resetDailyData}
                                className="w-10 h-10 bg-red-500 rounded-full items-center justify-center"
                            >
                                <Ionicons name="refresh" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        {todaysChallenge && (
                            <ChallengeCard
                                challenge={todaysChallenge}
                                onStart={startChallenge}
                                onComplete={completeChallenge}
                            />
                        )}
                    </Animated.View>

                    {/* Activités du jour */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-2xl font-bold text-gray-900">
                                Activités 🏋️
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowAddModal(true)}
                                className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center"
                            >
                                <Ionicons name="add" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <CardContent className="p-4">
                                {activities.length > 0 ? (
                                    <View>
                                        {activities.map((activity) => (
                                            <ActivityItem key={activity.id} activity={activity} />
                                        ))}
                                    </View>
                                ) : (
                                    <View className="py-12 items-center">
                                        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
                                            <Ionicons name="fitness-outline" size={40} color="#9CA3AF" />
                                        </View>
                                        <Text className="text-gray-600 text-lg font-medium mb-3">
                                            Aucune activité
                                        </Text>
                                        <Text className="text-gray-500 text-center">
                                            Ajoute ta première activité pour commencer !
                                        </Text>
                                    </View>
                                )}
                            </CardContent>
                        </Card>
                    </Animated.View>
                </View>
            </ScrollView>

            {/* Modal pour ajouter une activité */}
            <AddActivityModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={addActivity}
            />
        </SafeAreaView>
    );
} 