import { Text, View, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import { fetchMovieVideos, fetchTrendingMovies } from "../services/movieService";
import VideoPlayer from "./VideoPlayer";
import { router } from "expo-router";

const FeaturedMovie = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoKey, setVideoKey] = useState<string>('');
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    const loadFeaturedMovie = async () => {
      setLoading(true);
      try {
        const trendingMovies = await fetchTrendingMovies();
        
        // Filter movies that have backdrop images
        const moviesWithBackdrop = trendingMovies.filter(m => m.backdropPath);
        
        // If there are movies with backdrop, select one randomly from those
        // Otherwise, select any movie randomly from the full list
        const moviePool = moviesWithBackdrop.length > 0 ? moviesWithBackdrop : trendingMovies;
        
        // Get a random movie from the pool
        const randomIndex = Math.floor(Math.random() * moviePool.length);
        const featuredMovie = moviePool[randomIndex];
        
        setMovie(featuredMovie);
      } catch (error) {
        console.error("Failed to load featured movie:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovie();
  }, []);

  const handleWatchNow = async () => {
    if (!movie) return;
    
    setLoadingVideo(true);
    try {
      const videos = await fetchMovieVideos(movie.id);
      
      // Find the first official trailer, or any trailer, or just the first video
      const trailer = videos.find(v => v.type === 'Trailer' && v.official) || 
                      videos.find(v => v.type === 'Trailer') || 
                      videos[0];
      
      if (trailer && trailer.site.toLowerCase() === 'youtube') {
        setVideoKey(trailer.key);
        setIsVideoVisible(true);
      } else {
        console.log('No suitable video found');
      }
    } catch (error) {
      console.error('Error getting movie videos:', error);
    } finally {
      setLoadingVideo(false);
    }
  };

  const closeVideo = () => {
    setIsVideoVisible(false);
  };

  const handleViewDetails = () => {
    if (movie) {
      router.push({
        pathname: "/movie/[id]",
        params: { id: movie.id }
      });
    }
  };

  if (loading) {
    return (
      <View style={{ margin: 20, height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={{ margin: 20, height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Failed to load featured movie</Text>
      </View>
    );
  }

  const releaseYear = movie.releaseDate ? movie.releaseDate.split('-')[0] : '';

  return (
    <View style={{ margin: 20 }}>
      <View style={{ 
        backgroundColor: colors.card, 
        height: 200, 
        borderRadius: 15,
        justifyContent: 'flex-end',
        overflow: 'hidden'
      }}>
        {/* Movie poster image */}
        <Image
          source={{ uri: movie.backdropPath || movie.posterPath || '' }}
          style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 15 }}
          resizeMode="cover"
        />
        
        {/* Movie poster overlay */}
        <View style={{ 
          position: 'absolute', 
          top: 0, right: 0, bottom: 0, left: 0, 
          backgroundColor: colors.overlay
        }} />
        
        {/* Rating */}
        <View style={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12
        }}>
          <Text style={{ color: colors.rating, marginRight: 5 }}>★</Text>
          <Text style={{ color: colors.text, fontWeight: 'bold' }}>{movie.voteAverage.toFixed(1)}</Text>
        </View>
        
        {/* Movie details */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>{movie.title}</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 5 }}>
            {releaseYear ? `Released ${releaseYear}` : 'Coming Soon'}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity 
              style={{ 
                backgroundColor: colors.primary, 
                padding: 10, 
                borderRadius: 10, 
                marginRight: 10
              }}
              activeOpacity={0.7}
              onPress={handleWatchNow}
              disabled={loadingVideo}
            >
              <Text style={{ color: colors.background, fontWeight: 'bold' }}>
                {loadingVideo ? 'Loading...' : 'Watch Now'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ 
                backgroundColor: colors.card, 
                padding: 10, 
                borderRadius: 10
              }}
              activeOpacity={0.7}
              onPress={handleViewDetails}
            >
              <Text style={{ color: colors.text, fontWeight: 'bold' }}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <VideoPlayer 
        visible={isVideoVisible} 
        videoKey={videoKey} 
        onClose={closeVideo} 
      />
    </View>
  );
};

export default FeaturedMovie;
