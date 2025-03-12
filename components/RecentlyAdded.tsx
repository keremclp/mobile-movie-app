import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import MovieCard from "./MovieCard";
import { colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import { fetchNowPlayingMovies } from "../services/movieService";
import { router } from "expo-router";

const RecentlyAdded = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const newMovies = await fetchNowPlayingMovies();
        setMovies(newMovies);
      } catch (error) {
        console.error("Failed to load recent movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <View>
      <Text style={{ paddingHorizontal: 20, fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>
        Recently Added
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
              year={movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}
              rating={movie.voteAverage}
              onPress={() => router.push({
                pathname: "/movie/[id]",
                params: { id: movie.id }
              })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RecentlyAdded;
