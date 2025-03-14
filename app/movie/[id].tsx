import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import VideoPlayer from '../../components/VideoPlayer';
import { useMovieDetails } from '../../hooks/useMovieDetails';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    movie,
    loading,
    videoKey,
    isVideoVisible,
    loadingVideo,
    handleWatchTrailer,
    closeVideo
  } = useMovieDetails(id);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load movie details</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back button */}
    <TouchableOpacity 
      style={styles.backButtonAbsolute} 
      onPress={() => router.back()}
    >
      <Text style={[styles.backButtonIcon, { paddingBottom: 10 }]}>←</Text>
    </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Movie backdrop */}
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: movie.backdropPath || movie.posterPath || '' }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
          <View style={styles.backdropOverlay} />
        </View>

        {/* Movie info */}
        <View style={styles.infoContainer}>
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
            <View style={styles.genresContainer}>
              {movie.genres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Watch trailer button */}
          <TouchableOpacity
            style={styles.watchButton}
            onPress={handleWatchTrailer}
            disabled={loadingVideo}
          >
            <Text style={styles.watchButtonText}>
              {loadingVideo ? 'Loading...' : 'Watch Trailer'}
            </Text>
          </TouchableOpacity>

          {/* Overview */}
          <View style={styles.overviewContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        </View>
      </ScrollView>

      <VideoPlayer 
        visible={isVideoVisible} 
        videoKey={videoKey} 
        onClose={closeVideo} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIcon: {
    color: colors.text,
    fontSize: 24,
  },
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
  infoContainer: {
    padding: 20,
  },
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
