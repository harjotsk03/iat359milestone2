import { View, Text, StyleSheet, FlatList } from "react-native";
import ReviewCard from "./ReviewCard";

export default function ReviewsSection({ location }) {
  console.log(location);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <View style={styles.reviewsContainer}>
        {location.comments &&
          location.comments.map((item) => (
            <ReviewCard key={item._id} review={item} />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  reviewsContainer: {
    gap: 10,
  },
});
