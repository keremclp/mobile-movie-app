import { Text, View, ScrollView } from "react-native";
import MovieCard from "./MovieCard";
import { colors } from "../constants/colors";

const ContinueWatching = () => {
  const movies = [
    {
      id: 1,
      title: "Dune",
      imageUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      progress: 70
    },
    {
      id: 2,
      title: "The Batman",
      imageUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      progress: 30
    },
    {
      id: 3,
      title: "Inception",
      imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      progress: 45
    }
  ];

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ paddingHorizontal: 20, fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>
        Continue Watching
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
        {movies.map(movie => (
          <MovieCard 
            key={movie.id}
            imageUrl={movie.imageUrl}
            title={movie.title}
            progress={movie.progress}
            width={140}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ContinueWatching;
