import { useState } from "react";
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet
} from "react-native";
import { colors } from "../constants/colors";
import { router } from "expo-router";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== '') {
      router.push({
        pathname: "/search",
        params: { query: query.trim() }
      });
      setQuery("");
    }
  };

  return (
    <View>
      <View style={styles.searchBar}>
        <Text style={{ color: colors.textMuted }}>🔍</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search movies..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setQuery("");
            }}
          >
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    marginLeft: 10,
    fontSize: 16,
    padding: 0, // Remove padding on some platforms
  },
  clearButton: {
    color: colors.textMuted,
    fontSize: 16,
    padding: 5,
  }
});

export default SearchBar;
