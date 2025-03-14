import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from 'firebase/auth';
import { colors } from '../../constants/colors';

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default ProfileInfo;
