import { API_BASE_URL, getApiKey } from './api.config';

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

/**
 * Find the best trailer from a list of videos
 * Prioritizes official trailers, then any trailer, then falls back to the first video
 */
export const findBestTrailer = (videos: MovieVideo[]): MovieVideo | null => {
  if (!videos || videos.length === 0) {
    return null;
  }
  
  return videos.find(v => v.type === 'Trailer' && v.official) || 
         videos.find(v => v.type === 'Trailer') || 
         videos[0];
};
