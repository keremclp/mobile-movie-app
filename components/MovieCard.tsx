import { Text, View, Image } from "react-native";
import { colors } from "../constants/colors";

type MovieCardProps = {
  imageUrl?: string | null;
  title: string;
  year?: string;
  progress?: number; // Progress percentage (0-100)
  width?: number;
  rating?: number;
};

const MovieCard = ({ imageUrl, title, year, progress, width = 120, rating }: MovieCardProps) => {
  return (
    <View style={{ marginRight: 15, width }}>
      <View style={{ height: 180, backgroundColor: colors.card, borderRadius: 10, marginBottom: 5, overflow: 'hidden' }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textMuted }}>No Image</Text>
          </View>
        )}
        
        {/* Rating badge */}
        {typeof rating === 'number' && !isNaN(rating) && (
          <View style={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Text style={{ color: colors.rating, fontSize: 10, marginRight: 2 }}>★</Text>
            <Text style={{ color: colors.text, fontSize: 10, fontWeight: 'bold' }}>
              {rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
      
      {/* Render progress bar if progress is provided */}
      {progress !== undefined && (
        <View style={{ height: 3, backgroundColor: colors.progressBackground, borderRadius: 2 }}>
          <View 
            style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: colors.primary, 
              borderRadius: 2 
            }} 
          />
        </View>
      )}
      
      <Text style={{ color: colors.text, marginTop: 8, fontWeight: progress ? '500' : 'normal' }}>{title}</Text>
      {year && <Text style={{ color: colors.textMuted, fontSize: 12 }}>{year}</Text>}
    </View>
  );
};

export default MovieCard;
