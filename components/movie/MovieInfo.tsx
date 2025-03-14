import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MovieDetails } from '../../types/movie';
import { colors } from '../../constants/colors';
import GenreList from './GenreList';

interface MovieInfoProps {
  movie: MovieDetails;
  onWatchTrailer: () => void;
  loadingVideo: boolean;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie, onWatchTrailer, loadingVideo }) => {
  return (
    <>
      {/* Poster and title section */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: movie.posterPath || '' }}
          style={styles.posterImage}
          resizeMode="cover"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          
          {movie.releaseDate && (
            <Text style={styles.releaseDate}>
              Released: {movie.releaseDate}
            </Text>
          )}
          
          {movie.runtime && (
            <Text style={styles.runtime}>
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </Text>
          )}
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.rating}>{movie.voteAverage.toFixed(1)}/10</Text>
          </View>
        </View>
      </View>

      {/* Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <GenreList genres={movie.genres} />
      )}

      {/* Watch trailer button */}
      <TouchableOpacity
        style={styles.watchButton}
        onPress={onWatchTrailer}
        disabled={loadingVideo}
      >
        <Text style={styles.watchButtonText}>
          {loadingVideo ? 'Loading...' : 'Watch Trailer'}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    marginTop: -70,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
    paddingTop: 80,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  releaseDate: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  runtime: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    color: colors.rating,
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  watchButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  watchButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MovieInfo;
