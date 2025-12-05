import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

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

  const searchMovie = async () => {
    if (!query.trim()) {
      setSearching(false);
      return;
    }

    setSearching(true);

    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
      );

      if (res.data.Search) {
        setSearchResults(res.data.Search);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.log("Error searching:", e);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchSeries();
    fetchHighest();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#A1A1E0",
              flex: 1,
            }}
          >
            MovieList
          </Text>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#1E203C",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 10,
              alignItems: "center",
              width: 160,
            }}
          >
            <Ionicons name="search" size={18} color="#aaa" />

            <TextInput
              placeholder="Search..."
              placeholderTextColor="#666"
              style={{
                color: "#fff",
                marginLeft: 8,
                flex: 1,
              }}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={searchMovie}
            />
          </View>
        </View>
        {searching && (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Search Results
            </Text>

            {searchResults.length === 0 ? (
              <Text style={{ color: "#aaa" }}>No results found.</Text>
            ) : (
              <FlatList
                data={searchResults}
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
                    <Text style={{ color: "#999", fontSize: 12 }}>
                      {item.Year}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}

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
            Movies to watch
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
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    marginTop: 8,
                  }}
                  numberOfLines={1}
                >
                  {item.Title}
                </Text>

                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Text>
                    {item.imdbRating && <StarRating rating={item.imdbRating} />}
                  </Text>
                  <Text style={{ color: "#ccc" }}>({item.Year})</Text>
                </View>
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
    minHeight: "100%",
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
