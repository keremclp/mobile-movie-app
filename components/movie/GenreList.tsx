import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface GenreListProps {
  genres: string[];
}

const GenreList: React.FC<GenreListProps> = ({ genres }) => {
  return (
    <View style={styles.genresContainer}>
      {genres.map((genre, index) => (
        <View key={index} style={styles.genreTag}>
          <Text style={styles.genreText}>{genre}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    marginBottom: 15,
  },
  genreTag: {
    backgroundColor: colors.card,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: colors.text,
    fontSize: 12,
  },
});

export default GenreList;
