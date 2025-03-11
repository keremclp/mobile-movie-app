import { Text, View, Image } from "react-native";
import { colors } from "../constants/colors";

type MovieCardProps = {
  imageUrl: string;
  title: string;
  year?: string;
  progress?: number; // Progress percentage (0-100)
  width?: number;
};

const MovieCard = ({ imageUrl, title, year, progress, width = 120 }: MovieCardProps) => {
  return (
    <View style={{ marginRight: 15, width }}>
      <View style={{ height: 180, backgroundColor: colors.card, borderRadius: 10, marginBottom: 5, overflow: 'hidden' }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
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
