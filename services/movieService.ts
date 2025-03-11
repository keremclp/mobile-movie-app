import { API_BASE_URL, API_IMAGE_BASE_URL, IMAGE_SIZES, getApiKey } from './api.config';
import { Movie, MovieDetails } from '../types/movie';

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/trending/movie/day?api_key=${getApiKey()}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch trending movies');
    
    const data = await response.json();
    return transformMovies(data.results);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const fetchNowPlayingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/now_playing?api_key=${getApiKey()}&language=en-US&page=1`
    );
    
    if (!response.ok) throw new Error('Failed to fetch now playing movies');
    
    const data = await response.json();
    return transformMovies(data.results);
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return [];
  }
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/popular?api_key=${getApiKey()}&language=en-US&page=1`
    );
    
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    
    const data = await response.json();
    return transformMovies(data.results);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

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
        ? `${API_IMAGE_BASE_URL}/${IMAGE_SIZES.poster.large}${data.poster_path}`
        : null,
      backdropPath: data.backdrop_path 
        ? `${API_IMAGE_BASE_URL}/${IMAGE_SIZES.backdrop.large}${data.backdrop_path}`
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

// Helper function to transform movies from API format to our app format
const transformMovies = (movies: any[]): Movie[] => {
  return movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path 
      ? `${API_IMAGE_BASE_URL}/${IMAGE_SIZES.poster.medium}${movie.poster_path}`
      : null,
    backdropPath: movie.backdrop_path 
      ? `${API_IMAGE_BASE_URL}/${IMAGE_SIZES.backdrop.medium}${movie.backdrop_path}`
      : null,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    overview: movie.overview
  }));
};
