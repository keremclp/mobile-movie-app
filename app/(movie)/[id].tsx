import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import VideoPlayer from '../../components/VideoPlayer';
import { styles } from './styles/movieDetailsStyles';
import MovieHeader from '../../components/movie/MovieHeader';
import MovieInfo from '../../components/movie/MovieInfo';
import MovieOverview from '../../components/movie/MovieOverview';

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
        <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
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
        <Text style={styles.backButtonIcon}>←</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <MovieHeader backdropPath={movie.backdropPath} />
        
        <View style={styles.infoContainer}>
          <MovieInfo 
            movie={movie}
            onWatchTrailer={handleWatchTrailer}
            loadingVideo={loadingVideo} 
          />
          
          <MovieOverview overview={movie.overview} />
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
