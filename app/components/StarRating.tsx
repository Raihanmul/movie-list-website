import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2);

  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(5)].map((_, i) => (
        <Ionicons
          key={i}
          name={i < stars ? "star" : "star-outline"}
          size={14}
          color="#FFD700"
        />
      ))}
    </View>
  );
}
