import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const ProfileHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ProfileHeader;
