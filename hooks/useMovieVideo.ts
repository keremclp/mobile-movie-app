import { useState } from 'react';
import { fetchMovieVideos, findBestTrailer } from '../services/videoService';

/**
 * Hook for handling movie trailer functionality
 * @param movieId The ID of the movie to fetch videos for
 */
export const useMovieVideo = (movieId?: number) => {
  const [videoKey, setVideoKey] = useState<string>('');
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const handleWatchTrailer = async () => {
    if (!movieId) return;
    
    setLoadingVideo(true);
    try {
      const videos = await fetchMovieVideos(movieId);
      const trailer = findBestTrailer(videos);
      
      if (trailer && trailer.site.toLowerCase() === 'youtube') {
        setVideoKey(trailer.key);
        setIsVideoVisible(true);
      } else {
        console.log('No suitable video found');
      }
    } catch (error) {
      console.error('Error getting movie videos:', error);
    } finally {
      setLoadingVideo(false);
    }
  };

  const closeVideo = () => {
    setIsVideoVisible(false);
  };

  return {
    videoKey,
    isVideoVisible,
    loadingVideo,
    handleWatchTrailer,
    closeVideo
  };
};

export default useMovieVideo;
