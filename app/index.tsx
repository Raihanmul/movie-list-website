import axios from "axios";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import StarRating from "./components/StarRating";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  imdbRating?: string;
};

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = Constants.expoConfig?.extra?.OMDB_API_KEY;

  const fetchMovies = async () => {
  setLoading(true);

  try {
    const res = await axios.get(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=wicked&page=1`
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


  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        🎬 Latest Movies
      </Text>

      {loading ? (
        <Text>Loading...</Text>
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

  {item.imdbRating && (
    <StarRating rating={item.imdbRating} />
  )}
</View>
            </View>
          )}
        />
      )}
    </View>
  );
}
