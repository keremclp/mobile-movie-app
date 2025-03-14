import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Movie } from '../types/movie';

export const useUserWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's watchlist
  const fetchWatchlist = async () => {
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().watchlist) {
        setWatchlist(userDoc.data().watchlist);
      } else {
        // Initialize watchlist if it doesn't exist
        await setDoc(userDocRef, { watchlist: [] }, { merge: true });
        setWatchlist([]);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add movie to watchlist
  const addToWatchlist = async (movie: Movie) => {
    if (!user) return;

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        watchlist: arrayUnion({
          ...movie,
          addedAt: new Date().toISOString()
        })
      });
      
      // Update local state
      setWatchlist(prev => [...prev, {
        ...movie,
        addedAt: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return;

    try {
      const movieToRemove = watchlist.find(m => m.id === movieId);
      if (!movieToRemove) return;

      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        watchlist: arrayRemove(movieToRemove)
      });
      
      // Update local state
      setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  // Check if a movie is in the watchlist
  const isInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  // Initial load
  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refreshWatchlist: fetchWatchlist
  };
};

export default useUserWatchlist;
