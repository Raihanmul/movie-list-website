import StarRating from "@/app/components/StarRating";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  imdbID: string;
};

export default function MovieDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const API_KEY = Constants.expoConfig?.extra?.OMDB_API_KEY;

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
      );

      // debug: cek response
      // console.log("fetchDetail response:", res.data);

      if (res?.data) {
        // Pastikan imdbID ada
        const detail = res.data as MovieDetail;
        if (!detail.imdbID) {
          console.warn("Warning: API response does not include imdbID", detail);
        }
        setMovie(detail);
        await checkIfSaved(detail.imdbID);
      } else {
        setMovie(null);
      }
    } catch (error) {
      console.log("Error fetching detail:", error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }, [API_KEY, id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // SAFE check: handle cases where savedMovies is corrupted or items missing imdbID
  const checkIfSaved = async (imdbID?: string) => {
    try {
      if (!imdbID) {
        setIsSaved(false);
        return;
      }
      const savedRaw = await AsyncStorage.getItem("savedMovies");
      // debug
      // console.log("savedRaw:", savedRaw);

      const savedList = savedRaw ? JSON.parse(savedRaw) : [];
      if (!Array.isArray(savedList)) {
        console.warn("savedMovies is not an array, clearing key.");
        await AsyncStorage.removeItem("savedMovies");
        setIsSaved(false);
        return;
      }

      // defensive: some items might be null/primitive; check before comparing
      const exists = savedList.some(
        (m: any) =>
          m && typeof m === "object" && "imdbID" in m && m.imdbID === imdbID
      );
      setIsSaved(Boolean(exists));
    } catch (err) {
      console.log("checkIfSaved error:", err);
      // kalau parse error atau lain2, set false
      setIsSaved(false);
    }
  };

  // Toggle save/remove with defensive checks + try/catch
  const toggleSave = async () => {
    if (!movie) return;

    try {
      const savedRaw = await AsyncStorage.getItem("savedMovies");
      let savedList = savedRaw ? JSON.parse(savedRaw) : [];

      if (!Array.isArray(savedList)) {
        // Jika korup, reset jadi array
        console.warn("savedMovies corrupted, resetting to empty array.");
        savedList = [];
      }

      // defensive: ensure movie.imdbID exists
      const imdbID = (movie as any).imdbID;
      if (!imdbID) {
        console.warn("Cannot save movie without imdbID:", movie);
        return;
      }

      const exists = savedList.some(
        (m: any) =>
          m && typeof m === "object" && "imdbID" in m && m.imdbID === imdbID
      );

      let updatedList;
      if (exists) {
        updatedList = savedList.filter(
          (m: any) =>
            !(
              m &&
              typeof m === "object" &&
              "imdbID" in m &&
              m.imdbID === imdbID
            )
        );
        setIsSaved(false);
      } else {
        // Save only relevant fields to avoid storing circular structures
        const movieToSave = {
          Title: movie.Title ?? "",
          Year: movie.Year ?? "",
          imdbID: movie.imdbID,
          Type: movie.Type ?? "",
          Poster: movie.Poster ?? "",
        };
        updatedList = [...savedList, movieToSave];
        setIsSaved(true);
      }

      await AsyncStorage.setItem("savedMovies", JSON.stringify(updatedList));
      // debug: show new list in console
      // console.log("updated savedMovies:", updatedList);
    } catch (err) {
      console.log("toggleSave error:", err);
    }
  };

  // helper: clear savedMovies (useful for debug; you can call this from console or temporary button)
  const clearSavedMovies = async () => {
    try {
      await AsyncStorage.removeItem("savedMovies");
      setIsSaved(false);
      console.log("savedMovies cleared");
    } catch (err) {
      console.log("clearSavedMovies error:", err);
    }
  };

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

      <View style={{ position: "relative" }}>
        <Image
          source={{
            uri:
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450",
          }}
          style={styles.poster}
        />

        {/* SAVE BUTTON */}
        <TouchableOpacity onPress={toggleSave} style={styles.saveBtn}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={32}
            color={isSaved ? "yellow" : "white"}
          />
        </TouchableOpacity>
      </View>

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
  saveBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
  },
  title: { fontSize: 28, fontWeight: "bold" },
  infoBox: { marginTop: 20, gap: 8 },
  bold: { fontWeight: "bold" },
});
