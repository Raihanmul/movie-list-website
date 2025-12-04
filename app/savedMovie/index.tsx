import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export default function SavedMovie() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved movies from AsyncStorage
  const loadSaved = async () => {
    setLoading(true);
    try {
      const saved = await AsyncStorage.getItem("savedMovies");
      setMovies(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.log("Error loading saved:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Saved Movies
      </Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : movies.length === 0 ? (
        <Text>Belum ada film yang disimpan</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20, flexDirection: "row", gap: 12 }}>
              <Image
                source={{
                  uri:
                    item.Poster !== "N/A"
                      ? item.Poster
                      : "https://via.placeholder.com/120x180",
                }}
                style={{ width: 100, height: 150, borderRadius: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  {item.Title}
                </Text>
                <Text style={{ color: "#666" }}>{item.Year}</Text>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.navContainer}>
        <View style={styles.navItem}>
          <Ionicons
            name="home"
            size={24}
            color="gray"
            onPress={() => router.back()}
          />
          <Text>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="bookmark" size={24} color="yellow" />
          <Text>Saved</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  navItem: {
    alignItems: "center",
  },
});
