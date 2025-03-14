import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { colors } from '../constants/colors';

interface MovieListProps {
  movies: Movie[];
  horizontal?: boolean;
  title?: string;
  emptyMessage?: string;
}

const MovieList: React.FC<MovieListProps> = ({
  movies, 
  horizontal = true, 
  title,
  emptyMessage = 'No movies available'
}) => {
  if (movies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}

      <ScrollView 
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={horizontal ? styles.scrollViewContent : styles.gridContent}
      >
        {movies.map(movie => (
          <MovieCard 
            key={movie.id}
            imageUrl={movie.posterPath}
            title={movie.title}
            year={movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}
            rating={movie.voteAverage}
            onPress={() => router.push({
              pathname: "/movie/[id]",
              params: { id: movie.id }
            })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingLeft: 20,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});

export default MovieList;
