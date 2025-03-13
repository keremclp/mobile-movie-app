import { Text, View, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { router } from 'expo-router';

type BottomNavigationProps = {
  currentScreen?: string;
};

const BottomNavigation = ({ currentScreen = "home" }: BottomNavigationProps) => {
  const navItems = [
    { icon: "🏠", label: "Home", route: "/", id: "home" },
    { icon: "🔍", label: "Explore", route: "/explore", id: "explore" },
    { icon: "❤️", label: "Watchlist", route: "/watchlist", id: "watchlist" },
    { icon: "👤", label: "Profile", route: "/profile", id: "profile" },
  ];

  const handleNavPress = (route: string) => {
    // Use replace instead of push to avoid navigation stack issues
    router.replace(route as any);
  };

  return (
    <View style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      backgroundColor: colors.navigationBackground,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: 'row',
      paddingBottom: 25,
      paddingTop: 12
    }}>
      {navItems.map((item) => (
        <TouchableOpacity 
          key={item.id}
          style={{ flex: 1, alignItems: 'center' }}
          onPress={() => handleNavPress(item.route)}
        >
          <Text style={{ color: item.id === currentScreen ? colors.primary : colors.textMuted }}>{item.icon}</Text>
          <Text style={{ color: item.id === currentScreen ? colors.primary : colors.textMuted, fontSize: 12, marginTop: 4 }}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavigation;
