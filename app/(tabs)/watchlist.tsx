import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import MovieCard from '../../components/MovieCard';
import useUserWatchlist from '../../hooks/useUserWatchlist';
import { useAuth } from '../../contexts/AuthContext';

export default function WatchlistScreen() {
  const { user, loading: authLoading } = useAuth();
  const { watchlist, loading, refreshWatchlist } = useUserWatchlist();

  // Check auth status
  React.useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login page if no user is authenticated
      router.replace('/(auth)/login');
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>My Watchlist</Text>
      </View>
      
      {watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your watchlist is empty</Text>
          <TouchableOpacity 
            style={styles.browseButton} 
            onPress={() => router.push('/explore')}
          >
            <Text style={styles.browseButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <MovieCard
                imageUrl={item.posterPath}
                title={item.title}
                year={item.releaseDate ? item.releaseDate.split('-')[0] : ''}
                rating={item.voteAverage}
                width={160}
                onPress={() => router.push({
                  pathname: "/movie/[id]",
                  params: { id: item.id }
                })}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  cardContainer: {
    flex: 1,
    padding: 10,
    maxWidth: '50%',
  },
});
