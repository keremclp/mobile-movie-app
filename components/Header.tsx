import { Text, View } from "react-native";
import { colors } from "../constants/colors";

const Header = () => {
  return (
    <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>MovieMate</Text>
      <Text style={{ color: colors.textSecondary, marginTop: 5 }}>Find your next favorite movie</Text>
    </View>
  );
};

export default Header;
