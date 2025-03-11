import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { colors } from "../constants/colors";
import { useState, useEffect } from "react";
import { fetchMovieGenres } from "../services/movieService";

const CategoryList = () => {
  const [categories, setCategories] = useState([
    { id: "trending", name: "Trending", active: true }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      setLoading(true);
      try {
        const genres = await fetchMovieGenres();
        
        // Add genres to our categories list, keeping the "Trending" option
        const updatedCategories = [
          { id: "trending", name: "Trending", active: true },
          ...genres.map((genre: any) => ({
            id: genre.id,
            name: genre.name,
            active: false
          }))
        ];
        
        setCategories(updatedCategories);
      } catch (error) {
        console.error("Failed to load genres:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading) {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 10, height: 40, justifyContent: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingVertical: 10 }}
    >
      {categories.map((category) => (
        <View 
          key={category.id}
          style={{ 
            backgroundColor: category.active ? colors.primary : colors.card, 
            padding: 10, 
            borderRadius: 20, 
            marginRight: 10 
          }}
        >
          <Text style={{ color: colors.text }}>{category.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CategoryList;
