import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "./components/StarRating";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  imdbRating?: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [highest, setHighest] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = Constants.expoConfig?.extra?.OMDB_API_KEY;

  const currentYear = new Date().getFullYear();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie&y=${currentYear}&type=movie&page=1`
      );

      if (res.data.Search) {
        const moviesWithRatings = await Promise.all(
          res.data.Search.map(async (movie: Movie) => {
            const detail = await axios.get(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
            );

            return {
              ...movie,
              imdbRating: detail.data.imdbRating,
            };
          })
        );

        setMovies(moviesWithRatings);
      }
    } catch (error) {
      console.log("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeries = async () => {
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=series&type=series&page=1`
      );

      if (res.data.Search) {
        const seriesWithRatings = await Promise.all(
          res.data.Search.map(async (item: Movie) => {
            const detail = await axios.get(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`
            );
            return { ...item, imdbRating: detail.data.imdbRating };
          })
        );

        setSeries(seriesWithRatings);
      }
    } catch (e) {
      console.log("Error fetching series:", e);
    }
  };

  const fetchHighest = async () => {
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie&page=3`
      );

      if (res.data.Search) {
        const highestWithRatings = await Promise.all(
          res.data.Search.map(async (item: Movie) => {
            const detail = await axios.get(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`
            );
            return { ...item, imdbRating: parseFloat(detail.data.imdbRating) };
          })
        );

        highestWithRatings.sort((a, b) => b.imdbRating! - a.imdbRating!);
        setHighest(highestWithRatings);
      }
    } catch (e) {
      console.log("Error fetching Highest:", e);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchSeries();
    fetchHighest();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            color: "#A1A1E0",
          }}
        >
          MovieList
        </Text>

        {loading ? (
          <View style={{ flex: 1 }}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <View>
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              New Movies
            </Text>

            <FlatList
              data={movies}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.imdbID}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ width: 120, marginRight: 14 }}
                  onPress={() => router.push(`/detail/${item.imdbID}`)}
                >
                  <Image
                    source={{
                      uri:
                        item.Poster !== "N/A"
                          ? item.Poster
                          : "https://via.placeholder.com/120x180",
                    }}
                    style={{ width: 120, height: 180, borderRadius: 8 }}
                  />

                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: 13,
                      fontWeight: "600",
                      marginTop: 6,
                    }}
                    numberOfLines={1}
                  >
                    {item.Title}
                  </Text>
                  <Text style={{ color: "#999", fontSize: 12 }}>
                    {item.Year}
                  </Text>
                  <Text>
                    {item.imdbRating && <StarRating rating={item.imdbRating} />}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: 20,
              paddingBottom: 10,
            }}
          >
            Popular Series
          </Text>

          <FlatList
            data={series}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.imdbID}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: 120, marginRight: 14 }}
                onPress={() => router.push(`/detail/${item.imdbID}`)}
              >
                <Image
                  source={{
                    uri:
                      item.Poster !== "N/A"
                        ? item.Poster
                        : "https://via.placeholder.com/120x180",
                  }}
                  style={{ width: 120, height: 180, borderRadius: 8 }}
                />

                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 13,
                    fontWeight: "600",
                    marginTop: 6,
                  }}
                  numberOfLines={1}
                >
                  {item.Title}
                </Text>

                <Text style={{ color: "#999", fontSize: 12 }}>{item.Year}</Text>

                <Text>
                  {item.imdbRating && <StarRating rating={item.imdbRating} />}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ marginTop: 26 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            Movies To Watch
          </Text>

          <FlatList
            data={highest}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.imdbID}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: 120, marginRight: 14 }}
                onPress={() => router.push(`/detail/${item.imdbID}`)}
              >
                <Image
                  source={{
                    uri:
                      item.Poster !== "N/A"
                        ? item.Poster
                        : "https://via.placeholder.com/120x180",
                  }}
                  style={{ width: 120, height: 180, borderRadius: 8 }}
                />

                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 13,
                    fontWeight: "600",
                    marginTop: 6,
                  }}
                  numberOfLines={1}
                >
                  {item.Title}
                </Text>
                <Text style={{ color: "#999", fontSize: 12 }}>{item.Year}</Text>
                <Text>
                  {item.imdbRating && <StarRating rating={item.imdbRating} />}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#A1A1E0" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/savedMovie")}
          >
            <Ionicons name="bookmark-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
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
