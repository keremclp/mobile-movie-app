import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../constants/colors';
import { signOut } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigation from '../components/BottomNavigation';

export default function ProfileScreen() {
  const { user, loading: authLoading, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Check auth status when component mounts
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login page if no user is authenticated
      router.replace('/login');
    }
  }, [user, authLoading]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      router.replace('/login');
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
      
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileImage}>
          <Text style={styles.profileInitial}>{user.email?.[0].toUpperCase() || '?'}</Text>
        </View>
        
        <Text style={styles.email}>{user.email}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Account ID</Text>
            <Text style={styles.infoValue}>{user.uid.slice(0, 10)}...</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>
              {user.metadata.creationTime ? 
                new Date(user.metadata.creationTime).toLocaleDateString() : 
                'Unknown'}
            </Text>
          </View>
        </View>
        
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
  },
  email: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  infoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  signOutButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
