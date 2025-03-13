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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import useLocations from "../hooks/useLocations";

// Import the List and Map components
import List from "../components/Spots/List";
import Map from "../components/Spots/Map";
import ListCard from "../components/Spots/ListCard";

export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [searchTerm, setSearchTerm] = useState("");

  // Get all locations data
  const { locations, loading, error } = useLocations();

  // Filter locations based on search term
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

  return (
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
          size={20}
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
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Custom List component that doesn't use useLocations hook */}
      {showMap ? (
        <Map locations={filteredLocations} />
      ) : (
        <List locations={filteredLocations} loading={loading} error={error} />
      )}
    </View>
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
    fontWeight: "600",
    color: "#888",
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
    fontWeight: "700",
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
    borderRadius: 20,
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
    fontSize: 16,
  },
});
