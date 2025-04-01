import { View, Text, StyleSheet, FlatList } from "react-native";
import ReviewCard from "./ReviewCard";

export default function ReviewsSection({ location }) {
  console.log(location);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      {location.comments.length > 0 ? (
        <View style={styles.reviewsContainer}>
          {location.comments &&
            location.comments.map((item) => (
              <ReviewCard key={item._id} review={item} />
            ))}
        </View>
      ) : (
        <Text style={styles.noReviews}>No reviews yet</Text>
      )}
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
  noReviews: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#666",
    paddingBottom: 20,
  },
});
