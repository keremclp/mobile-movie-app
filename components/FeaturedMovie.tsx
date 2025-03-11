import { Text, View, Image } from "react-native";
import { colors } from "../constants/colors";

const FeaturedMovie = () => {
  return (
    <View style={{ margin: 20 }}>
      <View style={{ 
        backgroundColor: colors.card, 
        height: 200, 
        borderRadius: 15,
        justifyContent: 'flex-end',
        padding: 15,
        overflow: 'hidden'
      }}>
        {/* Movie poster image */}
        <Image
          source={{ uri: 'https://image.tmdb.org/t/p/w500/aCIFMriQh8rvhxpN1IWGgvH0Tlg.jpg' }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        
        {/* Movie poster overlay */}
        <View style={{ 
          position: 'absolute', 
          top: 0, right: 0, bottom: 0, left: 0, 
          backgroundColor: colors.overlay
        }} />
        
        {/* Rating */}
        <View style={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12
        }}>
          <Text style={{ color: colors.rating, marginRight: 5 }}>★</Text>
          <Text style={{ color: colors.text, fontWeight: 'bold' }}>8.4</Text>
        </View>
        
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold' }}>Tenet</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 5 }}>Action, Sci-Fi • 2020</Text>
        <View style={{ 
          backgroundColor: colors.primary, 
          alignSelf: 'flex-start', 
          paddingVertical: 8, 
          paddingHorizontal: 15, 
          borderRadius: 20, 
          marginTop: 10 
        }}>
          <Text style={{ color: colors.text, fontWeight: 'bold' }}>Watch Now</Text>
        </View>
      </View>
    </View>
  );
};

export default FeaturedMovie;
