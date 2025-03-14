import { API_IMAGE_BASE_URL, IMAGE_SIZES } from '../api.config';
import { Movie, MovieDetails } from '../../types/movie';

type ImageType = 'poster' | 'backdrop';
type ImageSize = 'small' | 'medium' | 'large';

// Helper function to get the image URL with proper size
export const getImageUrl = (path: string | null, type: ImageType, size: ImageSize): string | null => {
  if (!path) return null;
  return `${API_IMAGE_BASE_URL}/${IMAGE_SIZES[type][size]}${path}`;
};

// Transform movie data from API format to our app format
export const transformMovies = (movies: any[]): Movie[] => {
  if (!movies || !Array.isArray(movies)) return [];
  
  return movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path 
      ? getImageUrl(movie.poster_path, 'poster', 'medium')
      : null,
    backdropPath: movie.backdrop_path 
      ? getImageUrl(movie.backdrop_path, 'backdrop', 'medium')
      : null,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    overview: movie.overview
  }));
};

// Transform a single movie to MovieDetails format
export const transformMovieDetails = (movie: any): MovieDetails | null => {
  if (!movie) return null;
  
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path
      ? getImageUrl(movie.poster_path, 'poster', 'large')
      : null,
    backdropPath: movie.backdrop_path
      ? getImageUrl(movie.backdrop_path, 'backdrop', 'large')
      : null,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    runtime: movie.runtime,
    genres: movie.genres?.map((g: any) => g.name) || []
  };
};
