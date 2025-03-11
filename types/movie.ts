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
}

export interface MovieWithProgress extends Movie {
  progress: number;
}
