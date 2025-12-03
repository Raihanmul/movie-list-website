import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        "https://www.omdbapi.com/?apikey=fa0611ea&s=wednesday&page=1"
      );

      if (res.data.Search) {
        setMovies(res.data.Search as Movie[]);
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
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <View>
              <Image source={{ uri: item.Poster }} />
              <Text style={{ fontSize: 18, marginBottom: 6 }}>
                {item.Title} ({item.Year})
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
