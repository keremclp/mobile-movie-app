import { View, ScrollView, StatusBar } from "react-native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import FeaturedMovie from "../components/FeaturedMovie";
import ContinueWatching from "../components/ContinueWatching";
import RecentlyAdded from "../components/RecentlyAdded";
import BottomNavigation from "../components/BottomNavigation";
import { colors } from "../constants/colors";

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <Header />
      <SearchBar />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <CategoryList />
        <FeaturedMovie />
        <ContinueWatching />
        <RecentlyAdded />
      </ScrollView>
      
      <BottomNavigation />
    </View>
  );
}
