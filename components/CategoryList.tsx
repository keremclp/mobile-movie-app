import { ScrollView, Text, View } from "react-native";
import { colors } from "../constants/colors";

const CategoryList = () => {
const categories = [
    { name: "Trending", active: true },
    { name: "Action", active: false },
    { name: "Comedy", active: false },
    { name: "Drama", active: false },
    { name: "Sci-Fi", active: false },
    { name: "Horror", active: false },
    { name: "Romance", active: false },
    { name: "Thriller", active: false },
];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={true} 
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingVertical: 10 }}
    >
      {categories.map((category, index) => (
        <View 
          key={index}
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
