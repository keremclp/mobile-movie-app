import { API_BASE_URL, API_IMAGE_BASE_URL, IMAGE_SIZES, getApiKey } from './api.config';
import { Movie, MovieDetails } from '../types/movie';

export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}?api_key=${getApiKey()}&language=en-US`
    );
    
    if (!response.ok) throw new Error('Failed to fetch movie details');
    
    const data = await response.json();
    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      posterPath: data.poster_path
        ? getImageUrl(data.poster_path, 'poster', 'large')
        : null,
      backdropPath: data.backdrop_path
        ? getImageUrl(data.backdrop_path, 'backdrop', 'large')
        : null,
      releaseDate: data.release_date,
      voteAverage: data.vote_average,
      runtime: data.runtime,
      genres: data.genres?.map((g: any) => g.name) || []
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Helper function for image URLs
const getImageUrl = (filePath: string, imageType: 'poster' | 'backdrop', size: 'small' | 'medium' | 'large'): string => {
  return `${API_IMAGE_BASE_URL}/${IMAGE_SIZES[imageType][size]}${filePath}`;
};
