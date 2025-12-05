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

  const renderInfo = (label: string, value: string) => (
    <View style={styles.infoRow} key={label}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Ionicons
        name="arrow-back"
        size={30}
        color="white"
        onPress={() => router.back()}
        style={styles.backBtn}
      />

      <Text style={styles.mainTitle}>
        {movie.Title} ({movie.Year})
      </Text>

      <View style={styles.posterWrapper}>
        <Image
          source={{
            uri:
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450",
          }}
          style={styles.poster}
        />
        <TouchableOpacity onPress={toggleSave} style={styles.saveBtn}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={32}
            color={isSaved ? "yellow" : "white"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Movie Info</Text>

      <View style={styles.infoBox}>
        {renderInfo("Synopsis", movie.Plot)}
        {renderInfo("Director", movie.Director)}
        {renderInfo("Writer", movie.Writer)}
        {renderInfo("Rated", movie.Rated)}
        {renderInfo("Genre", movie.Genre)}
        {renderInfo("MainActor", movie.Actors)}
        {renderInfo("Rating", `${movie.imdbRating}/10`)}
        {renderInfo("Type", movie.Type)}
        {renderInfo("RunTime", movie.Runtime)}
        {renderInfo("Released", movie.Released)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0F1C",
    paddingHorizontal: 18,
  },

  backBtn: {
    marginTop: 10,
    marginBottom: 10,
  },

  mainTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
    marginBottom: 12,
  },

  posterWrapper: {
    position: "relative",
  },

  poster: {
    width: "100%",
    height: 430,
    borderRadius: 16,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  ratingText: {
    marginLeft: 6,
    color: "#A6A6A6",
    fontSize: 15,
  },
  saveBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginTop: 28,
    marginBottom: 10,
  },

  infoBox: {
    backgroundColor: "#2C2F46",
    borderRadius: 16,
    padding: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },

  infoLabel: {
    color: "#A6A6A6",
    fontWeight: "600",
    width: "35%",
  },

  infoValue: {
    color: "white",
    width: "65%",
    textAlign: "left",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
