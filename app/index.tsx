import { View, ScrollView, StatusBar, Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import FeaturedMovie from "../components/FeaturedMovie";
import RecentlyAdded from "../components/RecentlyAdded";
import BottomNavigation from "../components/BottomNavigation";
import { colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  // Uncomment this if you want to require authentication for the home page
  // Otherwise, users can browse without logging in
  /*
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return null;
  }
  */

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <Header user={user} />
      <SearchBar />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <CategoryList />
        <FeaturedMovie />
        <RecentlyAdded />
      </ScrollView>
      
      <BottomNavigation currentScreen="home" />
    </View>
  );
}
