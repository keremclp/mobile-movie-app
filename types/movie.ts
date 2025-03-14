export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  overview: string;
}

export interface MovieDetails extends Movie {
  runtime?: number;
  genres?: string[];
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  productionCompanies?: { id: number, name: string, logo_path: string | null }[];
}

export interface MovieWithProgress extends Movie {
  progress: number;
}

export interface WatchlistMovie extends Movie {
  addedAt: string;
}
