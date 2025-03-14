import { Stack } from "expo-router";
import { colors } from "../../constants/colors";

/**
 * Authentication layout
 * Groups all authentication-related screens
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
        }}
      />
    </Stack>
  );
}
