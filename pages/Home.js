/**
 * Home.js - Main Screen Component
 *
 * This component serves as the primary interface for the application's location-based features.
 * It provides a dual-view interface (List/Map) for displaying coffee spots/study locations,
 * along with detailed information about each location.
 *
 * Features:
 * - Toggle between List and Map views
 * - Search functionality for locations
 * - Location details drawer with amenities and reviews
 * - Rating system for locations
 *
 * @component
 */

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Image,
  Easing,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import useLocations from "../hooks/useLocations";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import the List and Map components
import List from "../components/Spots/List";
import Map from "../components/Spots/Map";
import ListCard from "../components/Spots/ListCard";

// Import the AmenitiesSection component
import AmenitiesSection from "../components/Amenities/AmenitiesSection";
import ReviewsSection from "../components/Reviews/ReviewsSection";
import RatingModal from "../components/Reviews/RatingModal.js";

export default function Home() {
  /**
   * State Management
   */
  const [showMap, setShowMap] = useState(false); // Controls view mode (List/Map)
  const [animation] = useState(new Animated.Value(0)); // Animation value for view toggle
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [selectedLocation, setSelectedLocation] = useState(null); // Currently selected location
  const [drawerVisible, setDrawerVisible] = useState(false); // Controls drawer visibility
  const [userProfile, setUserProfile] = useState(null); // Logged in user's profile
  const [drawerAnimation] = useState(new Animated.Value(0)); // Drawer animation value
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false); // Rating modal visibility

  /**
   * Effects
   */

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfileString = await AsyncStorage.getItem("userProfile");
        if (userProfileString) {
          const profile = JSON.parse(userProfileString);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    loadUserProfile();
  }, []);

  // Get locations data using custom hook
  const { locations, loading, error } = useLocations();

  /**
   * Location Filtering
   * Filters locations based on search term, checking against multiple criteria:
   * - Name
   * - Key
   * - Place name
   * - City
   * - Country
   * - Amenities (wifi, outlets)
   * - Opening hours
   */
  const filteredLocations = locations.filter((location) => {
    if (searchTerm === "") return true;

    return (
      location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.spotLocationInfo?.place_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      location.spotLocationInfo?.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      location.spotLocationInfo?.country
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (location.wifi && "wifi".includes(searchTerm.toLowerCase())) ||
      (location.outlets && "outlets".includes(searchTerm.toLowerCase())) ||
      location.openHours?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  /**
   * View Toggle Animation
   * Handles the animation between List and Map views
   */
  const toggleView = () => {
    const toValue = showMap ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();

    setShowMap(!showMap);
  };

  const sliderPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 76],
  });

  /**
   * Drawer Management
   * Functions to handle the location details drawer
   */
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setDrawerVisible(true);
    Animated.timing(drawerAnimation, {
      toValue: 1,
      duration: 450,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 450,
      easing: Easing.bezier(0.6, 0.04, 0.98, 0.335),
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false);
    });
  };

  const drawerTranslateY = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  /**
   * Rating Submission
   * Handles the submission of user ratings for locations
   */
  const handleRatingSubmit = async (ratingData) => {
    console.log("Starting handleRatingSubmit function");

    if (!selectedLocation) {
      console.error("selectedLocation is undefined");
      return;
    }
    if (!userProfile) {
      console.error("userProfile is undefined");
      return;
    }

    console.log("ratingData:", ratingData);
    console.log("selectedLocation:", selectedLocation);
    console.log("userProfile:", userProfile);

    try {
      // Create request body with required fields
      const requestBody = {
        rating: ratingData.rating,
        username: userProfile.username,
        userId: userProfile._id,
      };

      // Only add comment to request body if it exists and is not empty
      if (ratingData.comment && ratingData.comment.trim()) {
        requestBody.comment = ratingData.comment;
      }

      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/locations/addReview/${selectedLocation._id}`,
        requestBody
      );

      setIsRatingModalVisible(false);

      // Refresh the location data to show the new review
      if (response.data.data) {
        setSelectedLocation(response.data.data);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={styles.toggleOption}
            onPress={() => toggleView()}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, !showMap && styles.activeText]}>
              List
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleOption}
            onPress={() => toggleView()}
            activeOpacity={0.7}
          >
            <Text style={[styles.toggleText, showMap && styles.activeText]}>
              Map
            </Text>
          </TouchableOpacity>

          <Animated.View style={[styles.slider, { left: sliderPosition }]} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={16}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            clearButtonMode="while-editing"
          />
          {searchTerm !== "" && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Ionicons name="close-circle" size={16} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Main Content - Map or List */}
        {showMap ? (
          <Map
            locations={filteredLocations}
            onLocationSelect={handleLocationSelect}
          />
        ) : (
          <List
            locations={filteredLocations}
            loading={loading}
            error={error}
            onLocationSelect={handleLocationSelect}
          />
        )}

        {/* Location Details Drawer */}
        {drawerVisible && (
          <View style={styles.drawerOverlay}>
            <TouchableOpacity
              style={styles.drawerBackdrop}
              activeOpacity={1}
              onPress={closeDrawer}
            />
            <Animated.View
              style={[
                styles.drawer,
                {
                  transform: [{ translateY: drawerTranslateY }],
                  opacity: drawerAnimation,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeDrawer}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>

              {selectedLocation && (
                <ScrollView style={styles.drawerContent}>
                  {selectedLocation.imageUrl && (
                    <Image
                      source={{ uri: selectedLocation.imageUrl }}
                      style={styles.drawerImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.drawerContentPadding}>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>
                        Rating: {selectedLocation.rating}
                        <Text style={styles.star}>★</Text>(
                        {selectedLocation.ratingCount})
                      </Text>
                    </View>
                    <Text style={styles.drawerTitle}>
                      {selectedLocation.name}
                    </Text>
                    <Text style={styles.drawerAddress}>
                      {selectedLocation.spotLocationInfo.place_name ||
                        `${selectedLocation.spotLocationInfo.city}, ${selectedLocation.spotLocationInfo.country}`}
                    </Text>

                    <View style={styles.locationInfo}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.hoursText}>
                        {selectedLocation.openHours}
                      </Text>
                    </View>

                    <AmenitiesSection location={selectedLocation} />

                    {selectedLocation.description && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>
                          {selectedLocation.description}
                        </Text>
                      </View>
                    )}

                    <ReviewsSection location={selectedLocation} />
                  </View>
                </ScrollView>
              )}
              {selectedLocation?.createdById !== userProfile?._id && (
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => setIsRatingModalVisible(true)}
                >
                  <Ionicons name="star" size={16} color="#ffffff" />
                  <Text style={styles.rateText}>Rate this spot</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
        )}

        {/* Add the Rating Modal */}
        <RatingModal
          visible={isRatingModalVisible}
          onClose={() => setIsRatingModalVisible(false)}
          onSubmit={handleRatingSubmit}
          locationId={selectedLocation?.id}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    marginBottom: 20,
    position: "relative",
    height: 40,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    zIndex: 1,
  },
  toggleText: {
    color: "#888",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  slider: {
    position: "absolute",
    width: 70,
    height: 32,
    borderRadius: 25,
    backgroundColor: "#007BFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 2000,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: "90%",
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  drawerBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    overflow: "hidden",
    borderTopRightRadius: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  drawerContent: {
    flex: 1,
  },
  drawerContentPadding: {
    padding: 20,
  },
  drawerImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  drawerTitle: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },
  drawerAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  hoursText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  amenitiesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 12,
  },
  amenitiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amenitiesRowAfter: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
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
  amenityAvailable2: {
    backgroundColor: "#f5f7fa",
  },
  amenityUnavailable: {
    backgroundColor: "#f5f5f5",
  },
  amenityText: {
    marginLeft: 8,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  amenitiesRowAfter: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  amenityItemWithLabel: {
    padding: 12,
    borderRadius: 10,
    width: "49%",
  },
  amenityLabel: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
    color: "#555",
  },
  amenityContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  amenityItemWithLabelFull: {
    padding: 12,
    borderRadius: 10,
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 1000,
    color: "white",
    zIndex: 1000,
    top: 10,
    padding: 5,
    right: 10,
  },
  rateText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "white",
  },
  rateButton: {
    backgroundColor: "#007BFF",
    borderRadius: 1000,
    padding: 10,
    alignItems: "center",
    position: "absolute",
    width: "95%",
    gap: 10,
    height: 40,
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
    left: 0,
    right: 0,
  },
  ratingText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "black",
  },
  star: {
    fontSize: 16,
    color: "#FFD700",
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
});
