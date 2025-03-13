import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ListCard = ({ location, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {location.imageUrl && (
        <Image
          source={{ uri: location.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.description}>
          {location.spotLocationInfo.city}, {location.spotLocationInfo.country}
        </Text>

        <View style={styles.locationInfo}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.hoursText}>{location.openHours}</Text>
        </View>
        <View style={styles.locationInfo}>
          <Ionicons name="wifi-outline" size={16} color="#666" />
          <Text style={styles.hoursText}>
            {location.wifi ? "Wifi Available" : "Wifi Not Available"}
          </Text>
        </View>
        <View style={styles.locationInfo}>
          <Ionicons name="power-outline" size={16} color="#666" />
          <Text style={styles.hoursText}>
            {location.outlets ? "Outlets Available" : "Outlets Not Available"}
          </Text>
        </View>

        <View style={styles.moreInfoContainer}>
          <Text style={styles.moreInfoText}>Click for more info</Text>
          <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  hoursText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#666",
  },
  moreInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    backgroundColor: "#f0f7ff",
    padding: 8,
    borderRadius: 8,
  },
  moreInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
    marginRight: 4,
  },
});

export default ListCard;
