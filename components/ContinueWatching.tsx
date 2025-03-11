import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import MovieCard from "./MovieCard";
import { colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import { fetchPopularMovies } from "../services/movieService";

const ContinueWatching = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const popularMovies = await fetchPopularMovies();
        
        // Take first 4 movies and assign random progress
        const watchingMovies = popularMovies.slice(0, 4).map(movie => ({
          ...movie,
          // Simulate random progress between 10-90%
          progress: Math.floor(Math.random() * 80) + 10
        }));
        
        setMovies(watchingMovies);
      } catch (error) {
        console.error("Failed to load continue watching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ paddingHorizontal: 20, fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>
        Continue Watching
      </Text>

      {loading ? (
        <View style={{ paddingLeft: 20, height: 180, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          {movies.map(movie => (
            <MovieCard 
              key={movie.id}
              imageUrl={movie.posterPath}
              title={movie.title}
              progress={(movie as any).progress}
              width={140}
              rating={movie.voteAverage}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ContinueWatching;
