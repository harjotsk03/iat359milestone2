import { View, Text, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ReviewCard({ review }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getPoster();
  }, []);

  const getPoster = async () => {
    try {
      if (review && review.userId) {
        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/locations/getPoster/${review.userId}`,
          { withCredentials: true }
        );

        if (data?.userInfo) {
          setUserInfo(data.userInfo);
        }
      }
    } catch (error) {
      console.error("Getting poster details failed", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userContainer}>
          {userInfo?.profilePhoto ? (
            <Image
              source={{ uri: userInfo.profilePhoto }}
              style={styles.userPhoto}
            />
          ) : (
            <View style={styles.userPhotoPlaceholder}>
              <Text style={styles.placeholderText}>
                {review.username?.charAt(0).toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <Text style={styles.username}>{review.username}</Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(review.timeStamp).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <Text
            key={index}
            style={index < review.rating ? styles.starFilled : styles.starEmpty}
          >
            ★
          </Text>
        ))}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.comment}>{review.comment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userPhoto: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginRight: 10,
  },
  userPhotoPlaceholder: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#757575",
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
  },
  timestamp: {
    color: "#757575",
    fontSize: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 2,
  },
  starFilled: {
    color: "#FFD700",
    fontSize: 18,
    marginRight: 2,
  },
  starEmpty: {
    color: "#D3D3D3",
    fontSize: 18,
    marginRight: 2,
  },
  contentContainer: {
    marginTop: 8,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  ratingText: {
    fontWeight: "bold",
    color: "#555",
  },
});
