import { Text, View, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { User } from "firebase/auth";
import { router } from "expo-router";

interface HeaderProps {
  user?: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const handleAuthAction = () => {
    if (user) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  return (
    <View style={{ 
      paddingTop: 50, 
      paddingHorizontal: 20, 
      paddingBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <View>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>MovieMate</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 5 }}>Find your next favorite movie</Text>
      </View>
      
      <TouchableOpacity onPress={handleAuthAction}>
        {user ? (
          <View style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: colors.primary,
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>
              {user.email?.[0].toUpperCase() || '?'}
            </Text>
          </View>
        ) : (
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;
