import { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Image,
  StyleSheet
} from "react-native";
import { colors } from "../constants/colors";
import { searchMovies } from "../services/movieService";
import { Movie } from "../types/movie";
import { router } from "expo-router";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Create a debounce function to avoid making too many API calls
    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 1) {
        setLoading(true);
        setShowResults(true);
        try {
          const searchResults = await searchMovies(query);
          setResults(searchResults);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500); // 500ms debounce time

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleMoviePress = (movieId: number) => {
    setQuery("");
    setShowResults(false);
    router.push({
      pathname: "/movie/[id]",
      params: { id: movieId }
    });
  };

  return (
    <View>
      <View style={styles.searchBar}>
        <Text style={{ color: colors.textMuted }}>🔍</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search movies..."
          placeholderTextColor={colors.textMuted}
        />
        {query.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setQuery("");
              setShowResults(false);
            }}
          >
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <View style={styles.resultsContainer}>
          {loading ? (
            <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
          ) : results.length > 0 ? (
            <ScrollView 
              style={styles.scrollView} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {results.map((movie) => (
                <TouchableOpacity 
                  key={movie.id} 
                  style={styles.resultItem}
                  onPress={() => handleMoviePress(movie.id)}
                >
                  <View style={styles.resultContent}>
                    {movie.posterPath ? (
                      <Image 
                        source={{ uri: movie.posterPath }} 
                        style={styles.poster}
                      />
                    ) : (
                      <View style={styles.noPoster}>
                        <Text style={styles.noPosterText}>No Image</Text>
                      </View>
                    )}
                    <View style={styles.movieInfo}>
                      <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
                      <Text style={styles.releaseYear}>
                        {movie.releaseDate ? movie.releaseDate.split('-')[0] : 'Unknown year'}
                      </Text>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingStar}>★</Text>
                        <Text style={styles.rating}>{movie.voteAverage.toFixed(1)}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No movies found</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    marginLeft: 10,
    fontSize: 16,
    padding: 0, // Remove padding on some platforms
  },
  clearButton: {
    color: colors.textMuted,
    fontSize: 16,
    padding: 5,
  },
  resultsContainer: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: -15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    maxHeight: 350,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    maxHeight: 350,
  },
  resultItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    width: 45,
    height: 68,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  noPoster: {
    width: 45,
    height: 68,
    borderRadius: 4,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    color: colors.textMuted,
    fontSize: 10,
  },
  movieInfo: {
    marginLeft: 12,
    flex: 1,
  },
  movieTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  releaseYear: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    color: colors.rating,
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loader: {
    paddingVertical: 30,
  },
  noResults: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  noResultsText: {
    color: colors.textSecondary,
    fontSize: 16,
  }
});

export default SearchBar;
