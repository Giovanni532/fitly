import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BirthDateModal } from './BirthDateModal';

const { width } = Dimensions.get('window');

export function SignupForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showBirthDateModal, setShowBirthDateModal] = useState(false);
    const { signup, signInWithGoogle } = useAuth();

    // Animations avec useRef pour éviter les re-créations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const logoScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation d'entrée
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
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleSignup = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setIsLoading(true);

        // Animation du bouton
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        try {
            const result = await signup(email, password, { firstName, lastName });
            if (result.success) {
                Alert.alert('Succès', 'Compte créé avec succès !');
                // Afficher le modal de date de naissance
                setShowBirthDateModal(true);
            } else {
                Alert.alert('Erreur', result.error || 'Erreur lors de la création du compte');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithGoogle();
            if (!result.success) {
                Alert.alert('Erreur', result.error || 'Erreur lors de la connexion Google');
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue');
        }
    };

    const handleBirthDateComplete = () => {
        setShowBirthDateModal(false);
        // L'utilisateur sera automatiquement redirigé vers l'app principale
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="px-6 py-8">
                            {/* Logo animé */}
                            <Animated.View
                                style={{
                                    transform: [{ scale: logoScale }],
                                    opacity: fadeAnim
                                }}
                                className="items-center mb-8"
                            >
                                <View className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                                    <Text className="text-white text-2xl font-bold">F</Text>
                                </View>
                                <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                    Fitly
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-300 text-center">
                                    Créez votre compte
                                </Text>
                            </Animated.View>

                            {/* Formulaire animé */}
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    transform: [
                                        { translateY: slideAnim },
                                        { scale: scaleAnim }
                                    ]
                                }}
                            >
                                <Card className="w-full shadow-none border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl">
                                    <CardContent className="p-6 space-y-6">
                                        {/* Champs nom et prénom */}
                                        <View className="flex-row space-x-3 mb-4">
                                            <View className="flex-1 space-y-2 pr-2 w-full">
                                                <Label nativeID="firstName" className="text-gray-700 dark:text-gray-200 font-medium text-sm mb-2">
                                                    Prénom
                                                </Label>
                                                <Input
                                                    nativeID="firstName"
                                                    placeholder="Votre prénom"
                                                    value={firstName}
                                                    onChangeText={setFirstName}
                                                    autoCapitalize="words"
                                                    autoCorrect={false}
                                                    className="h-14 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl px-4 text-base"
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                            </View>
                                            <View className="flex-1 space-y-2 pl-2 w-full">
                                                <Label nativeID="lastName" className="text-gray-700 dark:text-gray-200 font-medium text-sm mb-2">
                                                    Nom
                                                </Label>
                                                <Input
                                                    nativeID="lastName"
                                                    placeholder="Votre nom"
                                                    value={lastName}
                                                    onChangeText={setLastName}
                                                    autoCapitalize="words"
                                                    autoCorrect={false}
                                                    className="h-14 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl px-4 text-base"
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                            </View>
                                        </View>

                                        {/* Champ email */}
                                        <View className="space-y-2 mb-4">
                                            <Label nativeID="signup-email" className="text-gray-700 dark:text-gray-200 font-medium text-sm mb-2">
                                                Email
                                            </Label>
                                            <View className="relative">
                                                <Input
                                                    nativeID="signup-email"
                                                    placeholder="Entrez votre email"
                                                    value={email}
                                                    onChangeText={setEmail}
                                                    autoCapitalize="none"
                                                    autoCorrect={false}
                                                    keyboardType="email-address"
                                                    className="h-14 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl px-4 text-base"
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                            </View>
                                        </View>

                                        {/* Champ password */}
                                        <View className="space-y-2 mb-4">
                                            <Label nativeID="signup-password" className="text-gray-700 dark:text-gray-200 font-medium text-sm mb-2">
                                                Mot de passe
                                            </Label>
                                            <View className="relative">
                                                <Input
                                                    nativeID="signup-password"
                                                    placeholder="Choisissez un mot de passe"
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    secureTextEntry={!showPassword}
                                                    textContentType="none"
                                                    autoComplete="off"
                                                    autoCorrect={false}
                                                    autoCapitalize="none"
                                                    spellCheck={false}
                                                    passwordRules=""
                                                    enablesReturnKeyAutomatically={false}
                                                    returnKeyType="done"
                                                    blurOnSubmit={false}
                                                    className="h-14 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl px-4 pr-12 text-base"
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-0 bottom-0 justify-center"
                                                >
                                                    <Text className="text-gray-500 text-sm">
                                                        {showPassword ? 'Masquer' : 'Voir'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* Champ confirm password */}
                                        <View className="space-y-2 mb-4">
                                            <Label nativeID="signup-confirm-password" className="text-gray-700 dark:text-gray-200 font-medium text-sm mb-2">
                                                Confirmer le mot de passe
                                            </Label>
                                            <View className="relative">
                                                <Input
                                                    nativeID="signup-confirm-password"
                                                    placeholder="Confirmez votre mot de passe"
                                                    value={confirmPassword}
                                                    onChangeText={setConfirmPassword}
                                                    secureTextEntry={!showConfirmPassword}
                                                    textContentType="none"
                                                    autoComplete="off"
                                                    autoCorrect={false}
                                                    autoCapitalize="none"
                                                    spellCheck={false}
                                                    passwordRules=""
                                                    enablesReturnKeyAutomatically={false}
                                                    returnKeyType="done"
                                                    blurOnSubmit={false}
                                                    className="h-14 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl px-4 pr-12 text-base"
                                                    placeholderTextColor="#9CA3AF"
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-0 bottom-0 justify-center"
                                                >
                                                    <Text className="text-gray-500 text-sm">
                                                        {showConfirmPassword ? 'Masquer' : 'Voir'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* Bouton d'inscription */}
                                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                            <Button
                                                onPress={handleSignup}
                                                disabled={isLoading}
                                                className="w-full my-2"
                                            >
                                                <Text className="text-white font-semibold text-base">
                                                    {isLoading ? 'Création en cours...' : 'Créer un compte'}
                                                </Text>
                                            </Button>
                                        </Animated.View>

                                        {/* Séparateur */}
                                        <View className="flex-row items-center space-x-4 my-2">
                                            <Separator className="flex-1 h-px bg-gray-200 dark:bg-gray-700 w-full mx-4" />
                                            <Text className="text-gray-500 text-sm">ou</Text>
                                            <Separator className="flex-1 h-px bg-gray-200 dark:bg-gray-700 w-full mx-4" />
                                        </View>

                                        {/* Bouton Google */}
                                        <TouchableOpacity
                                            onPress={handleGoogleSignup}
                                            className="w-full h-14 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex-row items-center justify-center space-x-3 shadow-sm"
                                        >
                                            <AntDesign name="google" size={20} color="#000" />
                                            <Text className="text-gray-700 dark:text-gray-200 font-medium text-base p-4">
                                                Continuer avec Google
                                            </Text>
                                        </TouchableOpacity>
                                    </CardContent>
                                </Card>
                            </Animated.View>

                            {/* Footer */}
                            <Animated.View
                                style={{ opacity: fadeAnim }}
                                className="mt-8 items-center"
                            >
                                <Text className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                    En créant un compte, vous acceptez nos conditions d'utilisation
                                </Text>
                            </Animated.View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {/* Modal de date de naissance */}
            <BirthDateModal
                visible={showBirthDateModal}
                onClose={() => setShowBirthDateModal(false)}
                onComplete={handleBirthDateComplete}
            />
        </>
    );
} 