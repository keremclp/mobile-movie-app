import { useState, useEffect } from 'react';
import { fetchMovieDetails } from '../services/movieService';
import { MovieDetails } from '../types/movie';
import useMovieVideo from './useMovieVideo';

export const useMovieDetails = (movieId: string) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use our movie video hook
  const { 
    videoKey, 
    isVideoVisible, 
    loadingVideo, 
    handleWatchTrailer: watchTrailer, 
    closeVideo 
  } = useMovieVideo(movie?.id);

  useEffect(() => {
    const loadMovieDetails = async () => {
      setLoading(true);
      try {
        const movieData = await fetchMovieDetails(Number(movieId));
        setMovie(movieData);
      } catch (error) {
        console.error("Failed to load movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadMovieDetails();
    }
  }, [movieId]);

  // Create a handler that will be available once the movie is loaded
  const handleWatchTrailer = () => {
    if (movie) {
      watchTrailer();
    }
  };

  return {
    movie,
    loading,
    videoKey,
    isVideoVisible,
    loadingVideo,
    handleWatchTrailer,
    closeVideo
  };
};
