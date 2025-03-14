import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface MovieOverviewProps {
  overview: string;
}

const MovieOverview: React.FC<MovieOverviewProps> = ({ overview }) => {
  return (
    <View style={styles.overviewContainer}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.overview}>{overview}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overviewContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  overview: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
});

export default MovieOverview;
