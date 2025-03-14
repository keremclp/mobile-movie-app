import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { colors } from "../../constants/colors";

/**
 * Tab navigation for the main sections of the app
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.navigationBackground,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 10,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -5,
          marginBottom: 5,
        }
      }}
    >
      <Tabs.Screen
        name="index" // Home screen
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore" // Explore screen
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>🔍</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist" // Watchlist screen
        options={{
          title: "Watchlist",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>❤️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // Profile screen
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
