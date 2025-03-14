import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { signOut } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import BottomNavigation from '../../components/BottomNavigation';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfo from '../../components/profile/ProfileInfo';
import { styles } from './styles/profileStyles';

export default function ProfileScreen() {
  const { user, loading: authLoading, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Check auth status when component mounts
  useEffect(() => {
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Return null if no user (will redirect in useEffect)
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ProfileHeader />
      
      <View style={styles.content}>
        <ProfileInfo user={user} />
        
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>

      <BottomNavigation currentScreen="profile" />
    </View>
  );
}
