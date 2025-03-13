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
}) => {
  // Only use the hook if props aren't provided
  const hookData = useLocations();

  // Use props if provided, otherwise use hook data
  const locations = propLocations || hookData.locations;
  const loading = propLoading !== undefined ? propLoading : hookData.loading;
  const error = propError || hookData.error;

  // State for the selected location and drawer animation
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [drawerAnimation] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  // Create pan responder for drag gestures
  const panResponder = PanResponder.create({
    // Only respond to gestures that start at the handle
    onStartShouldSetPanResponder: (evt, gestureState) => {
      // Check if the touch is in the handle area
      const { locationY } = evt.nativeEvent;
      return locationY < 30; // Only respond if touch is in handle area (30px height)
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        // Only allow downward movement (from 0 to positive)
        drawerAnimation.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      // If dragged down more than 100px, close the drawer
      if (gestureState.dy > 100) {
        closeDrawer();
      } else {
        // Otherwise snap back to open position
        Animated.spring(drawerAnimation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // Function to open the drawer with animation
  const openDrawer = (location) => {
    setSelectedLocation(location);
    // Reset fade animation to 0
    fadeAnim.setValue(0);
    // Initialize drawer position at the bottom (height value)
    drawerAnimation.setValue(height);
    // Start both animations together
    Animated.parallel([
      Animated.timing(drawerAnimation, {
        toValue: 0, // Animate to 0 (fully visible)
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Function to close the drawer with animation
  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnimation, {
        toValue: height, // Animate back to height (fully hidden)
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedLocation(null));
  };

  // Handle location selection
  const handleLocationPress = (location) => {
    openDrawer(location);
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

      {/* Bottom Drawer */}
      {selectedLocation && (
        <Modal
          transparent={true}
          visible={selectedLocation !== null}
          animationType="none"
          statusBarTranslucent={true}
          onRequestClose={closeDrawer}
        >
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <TouchableWithoutFeedback onPress={closeDrawer}>
              <View style={styles.modalOverlayTouch}>
                <TouchableWithoutFeedback>
                  <Animated.View
                    style={[
                      styles.drawer,
                      {
                        transform: [{ translateY: drawerAnimation }],
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                      },
                    ]}
                  >
                    {/* Close button */}
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeDrawer}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* Drawer Handle */}
                    <View
                      {...panResponder.panHandlers}
                      style={styles.drawerHandle}
                    >
                      <View style={styles.drawerHandleBar} />
                    </View>

                    {/* Image at the top of drawer with gradient overlay */}
                    {selectedLocation.imageUrl && (
                      <View style={styles.imageContainer}>
                        <Image
                          source={{ uri: selectedLocation.imageUrl }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                        <LinearGradient
                          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
                          style={styles.imageGradient}
                        />
                        <View style={styles.imageTextContainer}>
                          <Text style={styles.imageTitle}>
                            {selectedLocation.name}
                          </Text>
                          <View style={styles.locationBadge}>
                            <Ionicons name="location" size={16} color="#fff" />
                            <Text style={styles.locationBadgeText}>
                              {selectedLocation.spotLocationInfo.city},{" "}
                              {selectedLocation.spotLocationInfo.country}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Wrap the drawer content in ScrollView */}
                    <ScrollView
                      style={styles.scrollContainer}
                      showsVerticalScrollIndicator={true}
                      bounces={true}
                      contentContainerStyle={styles.scrollContentContainer}
                      scrollEnabled={true}
                      nestedScrollEnabled={true}
                    >
                      <View
                        style={styles.drawerContent}
                        pointerEvents="box-none"
                      >
                        {/* Hours section */}
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>Hours</Text>
                          <View style={styles.hoursCard}>
                            <Ionicons
                              name="time-outline"
                              size={22}
                              color="#4a90e2"
                            />
                            <Text style={styles.hoursText}>
                              {selectedLocation.openHours}
                            </Text>
                          </View>
                        </View>

                        {/* Amenities Section - Simplified */}
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>Amenities</Text>
                          <View style={styles.amenitiesGrid}>
                            {renderAmenityItem(
                              "wifi-outline",
                              "Wifi",
                              selectedLocation.wifi
                                ? "Available"
                                : "Unavailable",
                              selectedLocation.wifi
                            )}

                            {renderAmenityItem(
                              "power-outline",
                              "Power",
                              selectedLocation.outlets
                                ? "Available"
                                : "Unavailable",
                              selectedLocation.outlets
                            )}
                          </View>

                          <View style={styles.amenitiesGrid}>
                            {renderAmenityItem(
                              "pencil-outline",
                              "Whiteboards",
                              selectedLocation.whiteboards
                                ? "Available"
                                : "Unavailable",
                              selectedLocation.whiteboards
                            )}

                            {renderAmenityItem(
                              "people-outline",
                              "Group Work",
                              selectedLocation.groupWork
                                ? "Suitable"
                                : "Not Suitable",
                              selectedLocation.groupWork
                            )}
                          </View>
                          <View style={styles.amenitiesGrid}>
                            {renderAmenityItem(
                              "pencil-outline",
                              "Whiteboards",
                              selectedLocation.whiteboards
                                ? "Available"
                                : "Unavailable",
                              selectedLocation.whiteboards
                            )}

                            {renderAmenityItem(
                              "people-outline",
                              "Group Work",
                              selectedLocation.groupWork
                                ? "Suitable"
                                : "Not Suitable",
                              selectedLocation.groupWork
                            )}
                          </View>
                          <View style={styles.amenitiesGrid}>
                            {renderAmenityItem(
                              "pencil-outline",
                              "Whiteboards",
                              selectedLocation.whiteboards
                                ? "Available"
                                : "Unavailable",
                              selectedLocation.whiteboards
                            )}

                            {renderAmenityItem(
                              "people-outline",
                              "Group Work",
                              selectedLocation.groupWork
                                ? "Suitable"
                                : "Not Suitable",
                              selectedLocation.groupWork
                            )}
                          </View>
                          <View style={styles.amenitiesGrid}>
                            {renderAmenityItem(
                              "pencil-outline",
                              "Whiteboards",
                              selectedLocation.whiteboards
                                ? "Available"
                                : "Unavailable",
                              selectedLocation.whiteboards
                            )}

                            {renderAmenityItem(
                              "people-outline",
                              "Group Work",
                              selectedLocation.groupWork
                                ? "Suitable"
                                : "Not Suitable",
                              selectedLocation.groupWork
                            )}
                          </View>
                          <View style={styles.amenitiesGrid}>
                            {renderAmenityItem(
                              "pencil-outline",
                              "Whiteboards",
                              selectedLocation.whiteboards
                                ? "Available"
                                : "Unavailable",
                              selectedLocation.whiteboards
                            )}

                            {renderAmenityItem(
                              "people-outline",
                              "Group Work",
                              selectedLocation.groupWork
                                ? "Suitable"
                                : "Not Suitable",
                              selectedLocation.groupWork
                            )}
                          </View>

                          <View style={styles.amenitiesGrid}>
                            {renderAmenityItem(
                              "restaurant-outline",
                              "Food & Drink",
                              selectedLocation.foodDrink
                                ? "Allowed"
                                : "Not Allowed",
                              selectedLocation.foodDrink
                            )}
                          </View>
                        </View>

                        {/* Action buttons */}
                        <View style={styles.actionButtonsContainer}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="navigate-outline"
                              size={20}
                              color="#fff"
                            />
                            <Text style={styles.actionButtonText}>
                              Directions
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionButton, styles.saveButton]}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="bookmark-outline"
                              size={20}
                              color="#fff"
                            />
                            <Text style={styles.actionButtonText}>Save</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ScrollView>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f5f5f5",
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
    fontWeight: "500",
    color: "black",
    marginLeft: 20,
    marginTop: 12,
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
