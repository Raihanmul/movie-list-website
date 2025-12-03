import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  rating: string;
};

export default function StarRating({ rating }: Props) {
  const numericRating = Number(rating);

  const num = numericRating ? numericRating / 2 : 0;

  const fullStars = Math.floor(num);
  const halfStar = num - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={20} color="#FFD700" />
      ))}

      {halfStar && (
        <Ionicons name="star-half" size={20} color="#FFD700" />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={20} color="#FFD700" />
      ))}
    </View>
  );
}
