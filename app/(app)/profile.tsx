import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useProfileData } from '@/hooks/useProfileData';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { stats, loading, resetProgress } = useProfileData();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
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

    // Fonction pour obtenir l'initiale
    const getInitial = () => {
        if (user?.firstName) {
            return user.firstName.charAt(0).toUpperCase();
        } else if (user?.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        } else if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: () => logout(),
                },
            ]
        );
    };

    const handleResetProgress = () => {
        Alert.alert(
            'Réinitialiser la progression',
            'Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible.',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Réinitialiser',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await resetProgress();
                        if (success) {
                            Alert.alert('Succès', 'Progression réinitialisée');
                        } else {
                            Alert.alert('Erreur', 'Impossible de réinitialiser la progression');
                        }
                    },
                },
            ]
        );
    };

    const profileStats = [
        { label: 'Niveau', value: stats.currentLevel.toString(), icon: 'star-outline', color: '#F59E0B' },
        { label: 'Points', value: stats.totalPoints.toString(), icon: 'trophy-outline', color: '#10B981' },
        { label: 'Défis', value: stats.totalChallenges.toString(), icon: 'flag-outline', color: '#3B82F6' },
        { label: 'Activités', value: stats.totalActivities.toString(), icon: 'fitness-outline', color: '#8B5CF6' },
    ];

    const settingsItems = [
        {
            title: 'Notifications',
            icon: 'notifications-outline',
            type: 'switch' as const,
            value: notificationsEnabled,
            onValueChange: setNotificationsEnabled,
        },
        {
            title: 'Thème sombre',
            icon: 'moon-outline',
            type: 'switch' as const,
            value: theme === 'dark',
            onValueChange: (value: boolean) => setTheme(value ? 'dark' : 'light'),
        },
        {
            title: 'Réinitialiser la progression',
            icon: 'refresh-outline',
            type: 'button' as const,
            onPress: handleResetProgress,
            destructive: true,
        },
    ];

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-600 dark:text-gray-300">Chargement du profil...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 space-y-6">
                    {/* Header avec avatar et niveau */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                        className="items-center mb-6"
                    >
                        <View className="relative">
                            <View className="w-24 h-24 bg-gray-200 dark:bg-gray-600/30 rounded-full items-center justify-center ">
                                <Text className="text-gray-900 dark:text-white text-3xl font-bold">
                                    {getInitial()}
                                </Text>
                            </View>
                            {/* Badge de niveau */}
                            <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 dark:bg-yellow-500 rounded-full items-center justify-center border-2 border-white dark:border-gray-800">
                                <Text className="text-white text-xs font-bold">{stats.currentLevel}</Text>
                            </View>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {getDisplayName()}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            Niveau {stats.currentLevel} • {stats.totalPoints} points
                        </Text>
                        {/* Barre de progression du niveau */}
                        <View className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                            <View
                                className="h-2 bg-gradient-to-r from-amber-400 to-amber-500 dark:from-yellow-400 dark:to-yellow-600 rounded-full"
                                style={{ width: `${stats.progressToNextLevel * 100}%` }}
                            />
                        </View>
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                            {100 - (stats.totalPoints % 100)} points pour le niveau {stats.currentLevel + 1}
                        </Text>
                    </Animated.View>

                    {/* Statistiques */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-2xl my-4">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-gray-800 dark:text-white">
                                    Statistiques
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <View className="flex-row justify-around">
                                    {profileStats.map((stat, index) => (
                                        <View key={index} className="items-center space-y-2">
                                            <View
                                                className="w-12 h-12 rounded-full items-center justify-center"
                                                style={{ backgroundColor: `${stat.color}20` }}
                                            >
                                                <Ionicons
                                                    name={stat.icon as any}
                                                    size={20}
                                                    color={stat.color}
                                                />
                                            </View>
                                            <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                                                {stat.value}
                                            </Text>
                                            <Text className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                                {stat.label}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </CardContent>
                        </Card>
                    </Animated.View>

                    {/* Badges */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-2xl my-4">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-gray-800 dark:text-white">
                                    Badges obtenus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <View className="flex-row flex-wrap justify-center gap-3">
                                    {stats.badges.map((badge, index) => (
                                        <View
                                            key={badge.id}
                                            className={`items-center p-3 rounded-xl ${badge.unlocked
                                                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                                                : 'bg-gray-100 dark:bg-gray-700'
                                                }`}
                                            style={{ opacity: badge.unlocked ? 1 : 0.5 }}
                                        >
                                            <View
                                                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${badge.unlocked ? '' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                style={badge.unlocked ? { backgroundColor: getBadgeColor(badge.rarity) + '20' } : {}}
                                            >
                                                <Ionicons
                                                    name={badge.icon as any}
                                                    size={24}
                                                    color={badge.unlocked ? getBadgeColor(badge.rarity) : '#9CA3AF'}
                                                />
                                            </View>
                                            <Text className={`text-xs font-medium text-center ${badge.unlocked
                                                ? 'text-gray-800 dark:text-white'
                                                : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {badge.name}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </CardContent>
                        </Card>
                    </Animated.View>

                    {/* Paramètres */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-2xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-gray-800 dark:text-white">
                                    Paramètres
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {settingsItems.map((item, index) => (
                                    <View
                                        key={index}
                                        className="flex-row items-center justify-between py-3 px-2 rounded-xl"
                                    >
                                        <View className="flex-row items-center space-x-3">
                                            <Ionicons
                                                name={item.icon as any}
                                                size={20}
                                                color={item.destructive ? "#EF4444" : "#6B7280"}
                                            />
                                            <Text className={`font-medium ${item.destructive
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-gray-700 dark:text-gray-200'
                                                }`}>
                                                {item.title}
                                            </Text>
                                        </View>
                                        {item.type === 'switch' ? (
                                            <Switch
                                                value={item.value}
                                                onValueChange={item.onValueChange}
                                                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                                                thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                                            />
                                        ) : (
                                            <TouchableOpacity
                                                onPress={item.onPress}
                                                className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30"
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-red-600 dark:text-red-400 text-sm font-medium">
                                                    Réinitialiser
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </CardContent>
                        </Card>
                    </Animated.View>

                    {/* Bouton de déconnexion */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="w-full bg-red-500 dark:bg-red-600 rounded-2xl py-4 items-center shadow-lg mt-8"
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center space-x-2">
                                <Ionicons name="log-out-outline" size={20} color="white" />
                                <Text className="text-white font-semibold text-base">
                                    Se déconnecter
                                </Text>
                            </View>
                        </TouchableOpacity>
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

// Fonction utilitaire pour obtenir la couleur du badge selon sa rareté
function getBadgeColor(rarity: 'common' | 'rare' | 'epic' | 'legendary'): string {
    switch (rarity) {
        case 'common':
            return '#6B7280';
        case 'rare':
            return '#3B82F6';
        case 'epic':
            return '#8B5CF6';
        case 'legendary':
            return '#F59E0B';
        default:
            return '#6B7280';
    }
} 