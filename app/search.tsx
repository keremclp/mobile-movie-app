import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Modal,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../constants/colors';
import { searchMoviesAdvanced } from '../services/searchService';
import { fetchMovieGenres } from '../services/genreService';
import { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import BottomNavigation from '../components/BottomNavigation';

// Sort options
const sortOptions = [
  { id: 'popularity.desc', label: 'Most Popular' },
  { id: 'popularity.asc', label: 'Least Popular' },
  { id: 'release_date.desc', label: 'Newest' },
  { id: 'release_date.asc', label: 'Oldest' },
  { id: 'vote_average.desc', label: 'Highest Rated' },
  { id: 'vote_average.asc', label: 'Lowest Rated' },
  { id: 'title.asc', label: 'A-Z' },
  { id: 'title.desc', label: 'Z-A' },
];

// Year options (current year down to 1990)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1989 }, (_, i) => ({
  id: `${currentYear - i}`,
  label: `${currentYear - i}`
}));

// Rating options
const ratingOptions = [
  { id: '9', label: '9+' },
  { id: '8', label: '8+' },
  { id: '7', label: '7+' },
  { id: '6', label: '6+' },
  { id: '5', label: '5+' },
  { id: '0', label: 'All Ratings' },
];

// Memoized movie item component for better performance
const MovieItem = memo(({ item, onPress }: { item: Movie; onPress: () => void }) => (
  <MovieCard 
    imageUrl={item.posterPath}
    title={item.title}
    year={item.releaseDate ? item.releaseDate.split('-')[0] : ''}
    rating={item.voteAverage}
    width={160}
    onPress={onPress}
  />
));

export default function SearchScreen() {
  // Get search query from URL params
  const params = useLocalSearchParams<{ query: string }>();
  
  // States
  const [query, setQuery] = useState(params.query || '');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState<Array<{id: number, name: string}>>([]);
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  
  // Modal states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  
  // Load genres when component mounts
  useEffect(() => {
    const loadGenres = async () => {
      const genresList = await fetchMovieGenres();
      setGenres(genresList);
    };
    loadGenres();
  }, []);
  
  // Search function
  const searchMovies = async (resetPage = true) => {
    const searchPage = resetPage ? 1 : page;
    setLoading(true);
    
    try {
      const { results: movieResults, total_pages } = await searchMoviesAdvanced({
        query,
        page: searchPage,
        with_genres: selectedGenre ? selectedGenre.toString() : undefined,
        primary_release_year: selectedYear || undefined,
        'vote_average.gte': selectedRating || undefined,
        sort_by: sortBy
      });
      
      if (resetPage) {
        setResults(movieResults);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...movieResults]);
        setPage(searchPage + 1);
      }
      
      setTotalPages(total_pages);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial search when query or filters change
  useEffect(() => {
    if (query) {
      searchMovies(true);
    }
  }, [query, selectedGenre, selectedYear, selectedRating, sortBy]);
  
  // Handle search submit
  const handleSearch = () => {
    if (query.trim() !== '') {
      searchMovies(true);
      // Update URL with search query
      router.setParams({ query });
    }
  };
  
  // Handle load more
  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      searchMovies(false);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedRating(null);
    setSortBy('popularity.desc');
    setShowFilterModal(false);
  };
  
  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // Calculate item dimensions for getItemLayout
  const ITEM_WIDTH = 160;
  const ITEM_HEIGHT = 250; // Approximate height including title and spacing
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const numColumns = 2;
  
  // Use useCallback to prevent unnecessary re-renders
  const renderMovieItem = useCallback(({ item, index }: { item: Movie; index: number }) => (
    <MovieItem
      item={item}
      onPress={() => router.push({
        pathname: "/movie/[id]",
        params: { id: item.id }
      })}
    />
  ), []);
  
  // Generate getItemLayout for better list performance
  const getItemLayout = useCallback((data: ArrayLike<Movie> | null | undefined, index: number) => {
    const rowIndex = Math.floor(index / numColumns);
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * rowIndex,
      index,
    };
  }, []);
  
  // Generate unique keyExtractor
  const keyExtractor = useCallback((item: Movie, index: number) => {
    // Ensure unique keys by combining id and index
    return `${item.id}-${index}`;
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header with search bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search movies..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity 
              onPress={() => setQuery('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Filter and sort bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>
            Filter {(selectedGenre !== null || selectedYear !== null || selectedRating !== null) ? '•' : ''}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortButtonText}>
            Sort: {sortOptions.find(option => option.id === sortBy)?.label.split(' ')[0]}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Results count */}
      {results.length > 0 && (
        <Text style={styles.resultCount}>
          {results.length} results found
        </Text>
      )}
      
      {/* Results grid */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderMovieItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          maxToRenderPerBatch={10}
          windowSize={10}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.resultsList}
          columnWrapperStyle={styles.row}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            page < totalPages && loading ? (
              <ActivityIndicator color={colors.primary} style={styles.loadMoreSpinner} />
            ) : null
          }
          removeClippedSubviews={true}
        />
      ) : query ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No movies found</Text>
          <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
        </View>
      ) : (
        <View style={styles.noQueryContainer}>
          <Text style={styles.noQueryText}>Search for a movie</Text>
        </View>
      )}
      
      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filtersScroll}>
              {/* Genre filter */}
              <Text style={styles.filterSectionTitle}>Genres</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
                {genres.map(genre => (
                  <TouchableOpacity
                    key={genre.id}
                    style={[
                      styles.genreChip,
                      selectedGenre === genre.id ? styles.genreChipSelected : {}
                    ]}
                    onPress={() => setSelectedGenre(
                      selectedGenre === genre.id ? null : genre.id
                    )}
                  >
                    <Text
                      style={[
                        styles.genreChipText,
                        selectedGenre === genre.id ? styles.genreChipTextSelected : {}
                      ]}
                    >
                      {genre.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Year filter */}
              <Text style={styles.filterSectionTitle}>Year</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
                {yearOptions.slice(0, 10).map(year => (
                  <TouchableOpacity
                    key={year.id}
                    style={[
                      styles.yearChip,
                      selectedYear === year.id ? styles.yearChipSelected : {}
                    ]}
                    onPress={() => setSelectedYear(
                      selectedYear === year.id ? null : year.id
                    )}
                  >
                    <Text
                      style={[
                        styles.yearChipText,
                        selectedYear === year.id ? styles.yearChipTextSelected : {}
                      ]}
                    >
                      {year.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Rating filter */}
              <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
              <View style={styles.ratingContainer}>
                {ratingOptions.map(rating => (
                  <TouchableOpacity
                    key={rating.id}
                    style={[
                      styles.ratingChip,
                      selectedRating === rating.id ? styles.ratingChipSelected : {}
                    ]}
                    onPress={() => setSelectedRating(
                      selectedRating === rating.id ? null : rating.id
                    )}
                  >
                    <Text
                      style={[
                        styles.ratingChipText,
                        selectedRating === rating.id ? styles.ratingChipTextSelected : {}
                      ]}
                    >
                      {rating.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.sortModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sortOptionsContainer}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    sortBy === option.id ? styles.sortOptionSelected : {}
                  ]}
                  onPress={() => {
                    setSortBy(option.id);
                    setShowSortModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortBy === option.id ? styles.sortOptionTextSelected : {}
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortBy === option.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomNavigation currentScreen="explore" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
    color: colors.text,
  },
  searchContainer: {
    flex: 1,
    height: 40,
    backgroundColor: colors.card,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  sortButton: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  sortButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  resultCount: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    color: colors.textSecondary,
    fontSize: 14,
  },
  resultsList: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreSpinner: {
    paddingVertical: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noResultsSubtext: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  noQueryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQueryText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  sortModalContent: {
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 18,
    padding: 5,
  },
  filtersScroll: {
    maxHeight: '70%',
  },
  filterSectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
  },
  chipScrollView: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  genreChip: {
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  genreChipSelected: {
    backgroundColor: colors.primary,
  },
  genreChipText: {
    color: colors.text,
  },
  genreChipTextSelected: {
    color: colors.background,
    fontWeight: 'bold',
  },
  yearChip: {
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  yearChipSelected: {
    backgroundColor: colors.primary,
  },
  yearChipText: {
    color: colors.text,
  },
  yearChipTextSelected: {
    color: colors.background,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  ratingChip: {
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  ratingChipSelected: {
    backgroundColor: colors.primary,
  },
  ratingChipText: {
    color: colors.text,
  },
  ratingChipTextSelected: {
    color: colors.background,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  clearFiltersButton: {
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  clearFiltersText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  applyButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  sortOptionsContainer: {
    marginBottom: 20,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortOptionSelected: {
    backgroundColor: 'rgba(255,71,87,0.1)',
  },
  sortOptionText: {
    color: colors.text,
    fontSize: 16,
  },
  sortOptionTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  checkmark: {
    color: colors.primary,
    fontSize: 18,
  },
});
