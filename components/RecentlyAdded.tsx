import { Text, View, ScrollView } from "react-native";
import MovieCard from "./MovieCard";
import { colors } from "../constants/colors";

const RecentlyAdded = () => {
  const movies = [
    {
      id: 1,
      title: "Oppenheimer",
      imageUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      year: "2023"
    },
    {
      id: 2,
      title: "Barbie",
      imageUrl: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
      year: "2023"
    },
    {
      id: 3,
      title: "Everything Everywhere",
      imageUrl: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
      year: "2022"
    },
    {
      id: 4,
      title: "Avatar 2",
      imageUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      year: "2022"
    }
  ];

  return (
    <View>
      <Text style={{ paddingHorizontal: 20, fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>
        Recently Added
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
        {movies.map(movie => (
          <MovieCard 
            key={movie.id}
            imageUrl={movie.imageUrl}
            title={movie.title}
            year={movie.year}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentlyAdded;
