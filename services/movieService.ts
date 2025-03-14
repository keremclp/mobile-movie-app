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

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export const fetchMovieVideos = async (movieId: number): Promise<MovieVideo[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}/videos?api_key=${getApiKey()}&language=en-US`
    );
    
    if (!response.ok) throw new Error('Failed to fetch movie videos');
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return [];
  }
};

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

const getImageUrl = (filePath: string, imageType: 'poster' | 'backdrop', size: 'small' | 'medium' | 'large'): string => {
  return `${API_IMAGE_BASE_URL}/${IMAGE_SIZES[imageType][size]}${filePath}`;
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
