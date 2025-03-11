export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const API_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280'
  }
};

// Use this in a real app with proper environment variable setup
export const getApiKey = () => {
  // For demo purposes we're hardcoding the key
  // In a production app, use environment variables
  return process.env.EXPO_PUBLIC_TMDB_API_KEY || "YOUR_TMDB_API_KEY";
};
