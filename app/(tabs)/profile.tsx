import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { signOut } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfo from '../../components/profile/ProfileInfo';

export default function ProfileScreen() {
  const { user, loading: authLoading, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Check auth status when component mounts
  React.useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login page if no user is authenticated
      router.replace('/(auth)/login');
    }
  }, [user, authLoading]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Return null if no user (will redirect in useEffect)
  if (!user) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ProfileHeader />
      
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 40, paddingHorizontal: 20 }}>
        <ProfileInfo user={user} />
        
        <TouchableOpacity
          style={{ 
            backgroundColor: 'transparent', 
            borderWidth: 1, 
            borderColor: colors.primary,
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 30,
          }}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
