import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import BottomNavigation from '../components/BottomNavigation';
import RecentlyAdded from '../components/RecentlyAdded';
import { colors } from '../constants/colors';
import { fetchPopularMovies } from '../services/discoverService';
import { Movie } from '../types/movie';
import MovieList from '../components/MovieList';

export default function ExploreScreen() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const movies = await fetchPopularMovies();
        setPopularMovies(movies);
      } catch (error) {
        console.error('Error loading popular movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>
      
      <SearchBar />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CategoryList />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Movies</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <MovieList movies={popularMovies} />
          )}
        </View>
        
        <RecentlyAdded />
      </ScrollView>
      
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
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
});
