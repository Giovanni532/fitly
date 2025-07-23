import { Loading } from '@/components/ui/loading';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';
import { useNotifications } from '@/hooks/useNotifications';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';
import './global.css';

export default function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { activeTheme } = useTheme();
  const { user, isLoading } = useAuth();
  const { isInitialized: notificationsInitialized } = useNotifications();

  if (isLoading || !notificationsInitialized) {
    return <Loading message="Chargement de l'application..." />;
  }

  return (
    <View style={activeTheme} className="flex-1 bg-background">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      {user ? <Redirect href="/(app)/home" /> : <Redirect href="/(auth)/login" />}
    </View>
  );
}