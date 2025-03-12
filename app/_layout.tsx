import { Stack } from "expo-router";
import { Platform } from "react-native";
import { colors } from "../constants/colors";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
        // Use native stack animation options
        presentation: "card",
        animationDuration: 300,
      }}
    >
      <Stack.Screen 
        name="movie/[id]" 
        options={{
          presentation: "card",
          animationDuration: 300,
        }} 
      />
    </Stack>
  );
}
