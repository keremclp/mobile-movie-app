import { API_BASE_URL, getApiKey } from './api.config';
import { Movie } from '../types/movie';
import { transformMovies } from './utils/movieUtils';

export interface SearchParams {
  query: string;
  page?: number;
  with_genres?: string;
  primary_release_year?: string;
  'vote_average.gte'?: string;
  sort_by?: string;
  language?: string;
  include_adult?: boolean;
}

export interface SearchResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query || query.trim() === '') return [];
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/search/movie?api_key=${getApiKey()}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    );
    
    if (!response.ok) throw new Error('Failed to search movies');
    
    const data = await response.json();
    return transformMovies(data.results);
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const searchMoviesAdvanced = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    const queryParams = new URLSearchParams({
      api_key: getApiKey(),
      language: 'en-US',
      include_adult: 'false',
      page: params.page?.toString() || '1',
      query: params.query || '',
      ...Object.entries(params)
        .filter(([key, value]) => value !== undefined && key !== 'query' && key !== 'page')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    });

    const response = await fetch(
      `${API_BASE_URL}/search/movie?${queryParams}`
    );
    
    if (!response.ok) throw new Error('Failed to search movies');
    
    const data = await response.json();
    return {
      results: transformMovies(data.results),
      total_results: data.total_results,
      total_pages: data.total_pages
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return {
      results: [],
      total_results: 0,
      total_pages: 0
    };
  }
};
