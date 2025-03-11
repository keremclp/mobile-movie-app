import { Text, View, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import { fetchTrendingMovies } from "../services/movieService";

const FeaturedMovie = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedMovie = async () => {
      setLoading(true);
      try {
        const trendingMovies = await fetchTrendingMovies();
        // Get the first trending movie with a backdrop image
        const featuredMovie = trendingMovies.find(m => m.backdropPath) || trendingMovies[0];
        setMovie(featuredMovie);
      } catch (error) {
        console.error("Failed to load featured movie:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovie();
  }, []);

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
          <TouchableOpacity 
            style={{ 
              backgroundColor: colors.primary, 
              padding: 10, 
              borderRadius: 10, 
              marginTop: 10, 
              alignSelf: 'flex-start' 
            }}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.background, fontWeight: 'bold' }}>Watch Now</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

export default FeaturedMovie;
