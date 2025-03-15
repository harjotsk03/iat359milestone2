import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LabeledAmenity = ({ label, iconName, value }) => {
  return (
    <View style={styles.amenitiesRowAfter}>
      <View style={styles.amenityItemWithLabelFull}>
        <Text style={styles.amenityLabel}>{label}</Text>
        <View style={styles.amenityContent}>
          <Ionicons name={iconName} size={16} color="#4a90e2" />
          <Text style={styles.amenityText}>{value}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  amenitiesRowAfter: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  amenityItemWithLabelFull: {
    padding: 12,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "#f5f7fa",
  },
  amenityLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    color: "#555",
  },
  amenityContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 14,
    flexShrink: 1,
    flexWrap: "wrap",
  },
});

export default LabeledAmenity;
