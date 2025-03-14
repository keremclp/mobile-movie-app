import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "../constants/colors";
import "../services/firebase"; // Import Firebase initialization
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function RootLayoutNav() {
  const { loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // This ensures we don't show the Stack until after auth loading is done
    if (!loading) {
      setAppReady(true);
    }
  }, [loading]);

  if (!appReady) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        presentation: "card",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="movie/[id]" 
        options={{
          presentation: "card",
        }} 
      />
      <Stack.Screen name="login" options={{ gestureEnabled: false }} />
      <Stack.Screen name="register" options={{ gestureEnabled: false }} />
      <Stack.Screen name="profile" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
