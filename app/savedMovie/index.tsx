import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "../components/StarRating";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  imdbRating?: number;
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
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color:"#A1A1E0" }}>
        MovieList
      </Text>

     {loading ? (
  <Text>Loading...</Text>
) : movies.length === 0 ? (
  <View style={{ justifyContent: "center", alignItems: "center", marginTop: 160 }}>
    <Image
      source={require("@/assets/images/not-found.png")}
      style={{ width: 180, height: 180, marginBottom: 12 }}
      resizeMode="contain"
    />
    <Text style={{ color: "#FFFFFF", fontSize: 32, fontWeight: "bold", textAlign: "center" }}>Movies Not Found</Text>
  </View>
) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginBottom: 20, flexDirection: "row", gap: 12 }}
              onPress={() => router.push(`/detail/${item.imdbID}`)}
            >
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
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#FFFFFF" }}>
                  {item.Title}
                </Text>

                <Text style={{ color: "gray" }}>{item.Year}</Text>

                {item.imdbRating && <StarRating rating={item.imdbRating} />}
              </View>
            </TouchableOpacity>
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
        </View>
        <View style={styles.navItem}>
          <Ionicons name="bookmark" size={24} color="yellow" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#16182D",
    paddingBottom: 70,
  },
 navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#15151C",
    backgroundColor: "#15151C",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
});
