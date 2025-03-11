import { Text, View } from "react-native";
import { colors } from "../constants/colors";

const SearchBar = () => {
  return (
    <View style={{ 
      backgroundColor: colors.card, 
      marginHorizontal: 20, 
      marginBottom: 20,
      borderRadius: 10, 
      flexDirection: 'row', 
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 10,
    }}>
      <Text style={{ color: colors.textMuted }}>🔍</Text>
      <Text style={{ color: colors.textMuted, marginLeft: 10 }}>Search movies...</Text>
    </View>
  );
};

export default SearchBar;
