import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';
import { router } from 'expo-router';
import { registerUser, signIn, signOut, getCurrentUser, onAuthChanged } from '../services/authService';
import { User } from 'firebase/auth';

export default function FirebaseTestScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setCurrentUser(user);
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, [initializing]);

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await registerUser(email, password);
      setSuccess('User registered successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await signIn(email, password);
      setSuccess('Signed in successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await signOut();
      setSuccess('Signed out successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Initializing Firebase...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Firebase Authentication Test</Text>

      {/* Connection Status */}
      <View style={styles.statusCard}>
        <Text style={styles.cardTitle}>Firebase Connection Status:</Text>
        <Text style={[styles.statusText, { color: getCurrentUser() !== undefined ? colors.primary : 'red' }]}>
          {getCurrentUser() !== undefined ? 'Connected' : 'Not Connected'}
        </Text>
      </View>

      {/* Current User Info */}
      <View style={styles.statusCard}>
        <Text style={styles.cardTitle}>Current User:</Text>
        {currentUser ? (
          <>
            <Text style={styles.userInfoText}>Email: {currentUser.email}</Text>
            <Text style={styles.userInfoText}>User ID: {currentUser.uid}</Text>
            <Text style={styles.userInfoText}>Email Verified: {currentUser.emailVerified ? 'Yes' : 'No'}</Text>
          </>
        ) : (
          <Text style={styles.userInfoText}>No user signed in</Text>
        )}
      </View>

      {/* Auth Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Authentication Form</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Message display */}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { marginRight: 10 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {currentUser && (
          <TouchableOpacity 
            style={[styles.button, styles.signOutButton]}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
        
        {loading && <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfoText: {
    color: colors.textSecondary,
    marginBottom: 5,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
  },
  signOutButton: {
    backgroundColor: '#e74c3c',
    marginTop: 15,
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
  },
  successText: {
    color: '#2ecc71',
    marginBottom: 10,
  },
  loader: {
    marginTop: 15,
  },
  loadingText: {
    color: colors.text,
    marginTop: 10,
  }
});
