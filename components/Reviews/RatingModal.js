import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RatingModal({
  visible,
  onClose,
  onSubmit,
  locationId,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Add animation values
  const [overlayAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));

  // Add useEffect for animations
  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit({
      rating,
      comment,
      locationId,
    });
    // Reset form
    setRating(0);
    setComment("");
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: overlayAnim }]}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.title}>Rate this spot</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={rating >= star ? "star" : "star-outline"}
                  size={32}
                  color={rating >= star ? "#FFD700" : "#666"}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.commentLabel}>Comment (optional)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Write your review..."
            value={comment}
            onChangeText={setComment}
            multiline={true}
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={!rating}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    marginBottom: 20,
    marginTop: 10,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    color: "black",
    minHeight: 100,
    textAlignVertical: "top",
    fontFamily: "Poppins-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 1000,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#000000",
  },
  submitButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  commentLabel: {
    fontFamily: "Poppins-Medium",
    marginBottom: 5,
  },
});
