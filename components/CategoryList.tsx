import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { useState, useEffect } from "react";
import { fetchMovieGenres, fetchMoviesByGenre, fetchTrendingMovies } from "../services/movieService";
import { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

const CategoryList = () => {
  const [categories, setCategories] = useState([
    { id: "trending", name: "Trending", active: true }
  ]);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const handleCategoryPress = async (selectedId: string | number) => {
    // Don't do anything if already active
    if (categories.find(cat => cat.id === selectedId)?.active) {
      return;
    }
    
    // Update active category
    const updatedCategories = categories.map(category => ({
      ...category,
      active: category.id === selectedId
    }));
    setCategories(updatedCategories);
    
    // Fetch movies for selected category
    setLoadingMovies(true);
    try {
      let fetchedMovies;
      if (selectedId === "trending") {
        fetchedMovies = await fetchTrendingMovies();
      } else {
        fetchedMovies = await fetchMoviesByGenre(selectedId);
      }
      setMovies(fetchedMovies);
    } catch (error) {
      console.error("Failed to fetch movies for category:", error);
    } finally {
      setLoadingMovies(false);
    }
  };

  useEffect(() => {
    const loadGenres = async () => {
      setLoading(true);
      try {
        const genres = await fetchMovieGenres();
        
        // Add genres to our categories list, keeping the "Trending" option
        const updatedCategories = [
          { id: "trending", name: "Trending", active: true },
          ...genres.map((genre: any) => ({
            id: genre.id,
            name: genre.name,
            active: false
          }))
        ];
        
        setCategories(updatedCategories);
        
        // Load initial trending movies
        const trendingMovies = await fetchTrendingMovies();
        setMovies(trendingMovies);
      } catch (error) {
        console.error("Failed to load genres:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading) {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 10, height: 40, justifyContent: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryPress(category.id)}
            activeOpacity={0.7}
          >
            <View 
              style={{ 
                backgroundColor: category.active ? colors.primary : colors.card, 
                padding: 10, 
                borderRadius: 20, 
                marginRight: 10 
              }}
            >
              <Text style={{ color: colors.text }}>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Display genre movies */}
      {loadingMovies ? (
        <View style={{ paddingLeft: 20, height: 180, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View>
          <Text style={{ paddingHorizontal: 20, fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10, marginTop: 5 }}>
            {categories.find(c => c.active)?.name || 'Movies'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
            {movies.map(movie => (
              <MovieCard 
                key={movie.id}
                imageUrl={movie.posterPath}
                title={movie.title}
                year={movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}
                rating={movie.voteAverage}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CategoryList;
