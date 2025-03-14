import { API_IMAGE_BASE_URL, IMAGE_SIZES } from '../api.config';
import { Movie } from '../../types/movie';

type ImageType = 'poster' | 'backdrop';
type ImageSize = 'small' | 'medium' | 'large';

// Helper function to get the image URL with proper size
export const getImageUrl = (path: string, type: ImageType, size: ImageSize): string => {
  return `${API_IMAGE_BASE_URL}/${IMAGE_SIZES[type][size]}${path}`;
};

// Transform movie data from API format to our app format
export const transformMovies = (movies: any[]): Movie[] => {
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

// Add the getImageUrl function to the transformMovies object for easy access
transformMovies.getImageUrl = getImageUrl;
