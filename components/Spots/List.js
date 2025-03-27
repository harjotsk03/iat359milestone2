import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import useLocations from "../../hooks/useLocations";
import ListCard from "./ListCard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Get screen dimensions
const { height } = Dimensions.get("window");

// Accept locations as a prop, but fall back to the hook if not provided
const List = ({
  locations: propLocations,
  loading: propLoading,
  error: propError,
  onLocationSelect,
}) => {
  // Only use the hook if props aren't provided
  const hookData = useLocations();

  // Use props if provided, otherwise use hook data
  const locations = propLocations || hookData.locations;
  const loading = propLoading !== undefined ? propLoading : hookData.loading;
  const error = propError || hookData.error;

  // Handle location selection
  const handleLocationPress = (location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  // Simplify the renderAmenityItem function
  const renderAmenityItem = (iconName, title, status, isAvailable) => {
    return (
      <View style={styles.amenityItem}>
        <View
          style={[
            styles.amenityIcon,
            isAvailable ? styles.amenityAvailable : styles.amenityUnavailable,
          ]}
        >
          <Ionicons
            name={iconName}
            size={18}
            color={isAvailable ? "#4a90e2" : "#999"}
          />
        </View>
        <View style={styles.amenityTextContainer}>
          <Text style={styles.amenityTitle}>{title}</Text>
          <Text
            style={[
              styles.amenityStatus,
              isAvailable ? styles.statusAvailable : styles.statusUnavailable,
            ]}
          >
            {status}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (locations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No locations found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.resultsText}>Results: {locations.length}</Text>
      <FlatList
        data={locations}
        renderItem={({ item }) => (
          <ListCard location={item} onPress={() => handleLocationPress(item)} />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  resultsText: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "black",
    marginLeft: 20,
    marginTop: 2,
    paddingBottom: 10,
  },
  listContent: {
    paddingVertical: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: height * 0.85,
    maxHeight: height * 0.85,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 240,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  drawerHandle: {
    width: "100%",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 10,
  },
  drawerHandleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
  },
  drawerContent: {
    padding: 20,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  drawerAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  drawerDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 30, // Add some padding at the bottom
  },
  // Add these styles for amenities
  section: {
    marginBottom: 20,
    zIndex: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  amenitiesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",

    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
  },
  amenityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  amenityAvailable: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
  },
  amenityUnavailable: {
    backgroundColor: "rgba(153, 153, 153, 0.1)",
  },
  amenityTextContainer: {
    flex: 1,
  },
  amenityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  amenityStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  statusAvailable: {
    color: "#4a90e2",
  },
  statusUnavailable: {
    color: "#999",
  },
  hoursCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4a90e2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "48%",
  },
  saveButton: {
    backgroundColor: "#34c759",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imageTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  imageTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  locationBadgeText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  modalOverlayTouch: {
    flex: 1,
  },
});
export default List;
