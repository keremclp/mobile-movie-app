import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface MovieHeaderProps {
  backdropPath: string | null;
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ backdropPath }) => {
  return (
    <View style={styles.backdropContainer}>
      <Image
        source={{ uri: backdropPath || '' }}
        style={styles.backdropImage}
        resizeMode="cover"
      />
      <View style={styles.backdropOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  backdropContainer: {
    height: 250,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

export default MovieHeader;
