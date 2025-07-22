import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfilePage() {
    const { user, logout } = useAuth();

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

    const profileStats = [
        { label: 'Jours actifs', value: '7', icon: 'calendar-outline' },
        { label: 'Objectifs', value: '3', icon: 'flag-outline' },
        { label: 'Succès', value: '12', icon: 'trophy-outline' },
    ];

    const menuItems = [
        {
            title: 'Paramètres du compte',
            icon: 'settings-outline',
            onPress: () => Alert.alert('Paramètres', 'Fonctionnalité à venir'),
        },
        {
            title: 'Notifications',
            icon: 'notifications-outline',
            onPress: () => Alert.alert('Notifications', 'Fonctionnalité à venir'),
        },
        {
            title: 'Aide et support',
            icon: 'help-circle-outline',
            onPress: () => Alert.alert('Aide', 'Fonctionnalité à venir'),
        },
        {
            title: 'À propos',
            icon: 'information-circle-outline',
            onPress: () => Alert.alert('À propos', 'Fitly v1.0.0'),
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 space-y-6">
                    {/* Header avec avatar */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                        className="items-center mb-6"
                    >
                        <View className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full items-center justify-center mb-4 shadow-lg">
                            <Text className="text-white text-3xl font-bold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                            {user?.username}
                        </Text>
                        <Badge className="bg-blue-100 dark:bg-blue-900/30">
                            <Text className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                                Membre actif
                            </Text>
                        </Badge>
                    </Animated.View>

                    {/* Statistiques */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-2xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-gray-800 dark:text-white">
                                    Statistiques
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <View className="flex-row justify-around">
                                    {profileStats.map((stat, index) => (
                                        <View key={index} className="items-center space-y-2">
                                            <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center">
                                                <Ionicons
                                                    name={stat.icon as any}
                                                    size={20}
                                                    color="#3B82F6"
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

                    {/* Menu */}
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-2xl mt-4">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-gray-800 dark:text-white">
                                    Paramètres
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={item.onPress}
                                        className="flex-row items-center justify-between py-3 px-2 rounded-xl active:bg-gray-100 dark:active:bg-gray-700"
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row items-center space-x-3">
                                            <Ionicons
                                                name={item.icon as any}
                                                size={20}
                                                color="#6B7280"
                                            />
                                            <Text className="text-gray-700 dark:text-gray-200 font-medium">
                                                {item.title}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={16}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
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