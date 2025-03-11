import { Text, View } from "react-native";
import { colors } from "../constants/colors";

const BottomNavigation = () => {
  const navItems = [
    { icon: "🏠", label: "Home", active: true },
    { icon: "🔍", label: "Explore", active: false },
    { icon: "❤️", label: "Watchlist", active: false },
    { icon: "👤", label: "Profile", active: false },
  ];

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
      {navItems.map((item, index) => (
        <View key={index} style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: item.active ? colors.primary : colors.textMuted }}>{item.icon}</Text>
          <Text style={{ color: item.active ? colors.primary : colors.textMuted, fontSize: 12, marginTop: 4 }}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default BottomNavigation;
