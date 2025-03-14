import { API_BASE_URL, getApiKey } from './api.config';
import { Movie } from '../types/movie';
import { transformMovies } from './utils/movieUtils';

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
