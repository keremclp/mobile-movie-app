import { API_BASE_URL, getApiKey } from './api.config';
import { Movie } from '../types/movie';
import { transformMovies } from './utils/movieUtils';

export const fetchMovieGenres = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/genre/movie/list?api_key=${getApiKey()}&language=en-US`
    );
    
    if (!response.ok) throw new Error('Failed to fetch movie genres');
    
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId: string | number): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/discover/movie?api_key=${getApiKey()}&with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`
    );
    
    if (!response.ok) throw new Error(`Failed to fetch movies for genre ${genreId}`);
    
    const data = await response.json();
    return transformMovies(data.results);
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return [];
  }
};
