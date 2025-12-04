import StarRating from "@/app/components/StarRating";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type MovieDetail = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Type: string;
};

export default function MovieDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = Constants.expoConfig?.extra?.OMDB_API_KEY;

  const fetchDetail = async () => {
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
      );
      setMovie(res.data);
    } catch (error) {
      console.log("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text>Movie not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <Ionicons
        name="arrow-back"
        size={28}
        onPress={() => router.back()}
        style={styles.backBtn}
      />

      <Text style={styles.title}>
        {movie.Title} ({movie.Year})
      </Text>

      <Image
        source={{
          uri:
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450",
        }}
        style={styles.poster}
        resizeMode="cover"
      />

      {movie.imdbRating && movie.imdbRating !== "N/A" && (
        <View style={{ marginTop: 6 }}>
          <StarRating rating={movie.imdbRating} />
          <Text style={{ marginTop: 4 }}>⭐ {movie.imdbRating}/10</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text>
          <Text style={styles.bold}>Sinopsis:</Text> {movie.Plot}
        </Text>
        <Text>
          <Text style={styles.bold}>Director:</Text> {movie.Director}
        </Text>
        <Text>
          <Text style={styles.bold}>Writer:</Text> {movie.Writer}
        </Text>
        <Text>
          <Text style={styles.bold}>Rated:</Text> {movie.Rated}
        </Text>
        <Text>
          <Text style={styles.bold}>Genre:</Text> {movie.Genre}
        </Text>
        <Text>
          <Text style={styles.bold}>Main Actors:</Text> {movie.Actors}
        </Text>
        <Text>
          <Text style={styles.bold}>Type:</Text> {movie.Type}
        </Text>
        <Text>
          <Text style={styles.bold}>Runtime:</Text> {movie.Runtime}
        </Text>
        <Text>
          <Text style={styles.bold}>Released:</Text> {movie.Released}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { marginBottom: 12 },
  poster: {
    width: "100%",
    height: 400,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold" },
  year: { fontSize: 18, color: "#666" },
  infoBox: { marginTop: 20, gap: 8 },
  bold: { fontWeight: "bold" },
  plotTitle: { marginTop: 20, fontSize: 18, fontWeight: "600" },
  plotText: { marginTop: 6, color: "#333" },
});
