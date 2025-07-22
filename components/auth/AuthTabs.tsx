import React, { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthTabs() {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1">
                {/* Tabs */}
                <View className="flex-row border-b border-border bg-card">
                    <Pressable
                        onPress={() => setActiveTab('login')}
                        className={`flex-1 py-4 ${activeTab === 'login' ? 'border-b-2 border-primary' : ''}`}
                    >
                        <Text className={`text-center font-semibold text-base ${activeTab === 'login' ? 'text-primary' : 'text-muted-foreground'}`}>
                            Connexion
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab('signup')}
                        className={`flex-1 py-4 ${activeTab === 'signup' ? 'border-b-2 border-primary' : ''}`}
                    >
                        <Text className={`text-center font-semibold text-base ${activeTab === 'signup' ? 'text-primary' : 'text-muted-foreground'}`}>
                            Inscription
                        </Text>
                    </Pressable>
                </View>

                {/* Content */}
                <View className="flex-1">
                    {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
                </View>
            </View>
        </SafeAreaView>
    );
} 