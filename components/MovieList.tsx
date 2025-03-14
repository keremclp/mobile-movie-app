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
  numColumns?: number; // Added numColumns prop
}

const MovieList: React.FC<MovieListProps> = ({
  movies, 
  horizontal = true, 
  title,
  emptyMessage = 'No movies available',
  numColumns = 2 // Default to 2 columns
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
          <View 
            key={movie.id} 
            style={[
              styles.gridItem, 
              !horizontal && { width: `${100/numColumns}%` }
            ]}
          >
            <MovieCard 
              imageUrl={movie.posterPath}
              title={movie.title}
              year={movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}
              rating={movie.voteAverage}
              width={!horizontal ? '100%' : undefined}
              onPress={() => router.push({
                pathname: "/movie/[id]",
                params: { id: movie.id }
              })}
            />
          </View>
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
    paddingHorizontal: 20,
  },
  gridItem: {
    paddingHorizontal: 5,
    marginBottom: 15,
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
