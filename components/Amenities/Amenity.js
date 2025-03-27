import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Amenity = ({
  iconName,
  isAvailable,
  availableText,
  unavailableText,
  style,
}) => {
  return (
    <View
      style={[
        styles.amenityItem,
        isAvailable ? styles.amenityAvailable : styles.amenityUnavailable,
        style,
      ]}
    >
      <Ionicons
        name={iconName}
        size={16}
        color={isAvailable ? "#4a90e2" : "#999"}
      />
      <Text style={styles.amenityText}>
        {isAvailable ? availableText : unavailableText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    width: "49%",
  },
  amenityAvailable: {
    backgroundColor: "#e6f2ff",
  },
  amenityUnavailable: {
    backgroundColor: "#f5f5f5",
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 14,
    flexShrink: 1,
    flexWrap: "wrap",
    fontFamily: "Poppins-Medium",
  },
});

export default Amenity;
