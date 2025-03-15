import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { View as AnimatedView } from "react-native-animatable";
import customMarker from "../../assets/Vector.png";

const Map = ({ locations, onLocationSelect, isDrawerOpen }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 49.2827, // Default fallback: Vancouver coordinates
    longitude: -123.1207,
    latitudeDelta: 0.02, // Smaller value for more zoom (was 0.0922)
    longitudeDelta: 0.02, // Smaller value for more zoom (was 0.0421)
  });
  // Add this state to track if the map has been manually positioned
  const [mapManuallyPositioned, setMapManuallyPositioned] = useState(false);

  // Create a ref for the map
  const mapRef = React.useRef(null);

  // Add this custom map style to hide all map elements except the base map
  const mapStyle = [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ visibility: "on" }],
    },
  ];

  // Request location permissions and get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(userLoc);

        // Set initial region to user's location with adjusted zoom
        const zoomLevel = 0.005; // Smaller value = more zoom
        const newRegion = {
          latitude: userLoc.latitude,
          longitude: userLoc.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        };

        setMapRegion(newRegion);

        // Only center map on user initially if map hasn't been manually positioned
        if (mapRef.current && !mapManuallyPositioned) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    })();
  }, [mapManuallyPositioned]);

  // Calculate the center and zoom level based on provided locations
  useEffect(() => {
    // Only center map on locations if available AND map hasn't been manually positioned
    if (locations && locations.length > 0 && !mapManuallyPositioned) {
      // Calculate the center point of all locations
      const lats = locations.map((loc) =>
        parseFloat(loc.location?.lat || loc.lat)
      );
      const longs = locations.map((loc) =>
        parseFloat(loc.location?.long || loc.long)
      );

      // Filter out any NaN values
      const validLats = lats.filter((lat) => !isNaN(lat));
      const validLongs = longs.filter((long) => !isNaN(long));

      if (validLats.length > 0 && validLongs.length > 0) {
        const avgLat =
          validLats.reduce((sum, lat) => sum + lat, 0) / validLats.length;
        const avgLong =
          validLongs.reduce((sum, long) => sum + long, 0) / validLongs.length;

        // Calculate appropriate delta values with adjusted minimum zoom
        const minZoom = 0.005; // Smaller value = more zoom (was 0.0922)
        const latDelta = Math.max(
          minZoom,
          Math.max(...validLats) - Math.min(...validLats) + 0.02 // Reduced padding (was 0.05)
        );
        const longDelta = Math.max(
          minZoom,
          Math.max(...validLongs) - Math.min(...validLongs) + 0.02 // Reduced padding (was 0.05)
        );

        // Update map region
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: avgLat,
              longitude: avgLong,
              latitudeDelta: latDelta,
              longitudeDelta: longDelta,
            },
            1000
          );
          // Set flag that map has been positioned based on locations
          setMapManuallyPositioned(true);
        }
      }
    }
  }, [locations, mapManuallyPositioned]);

  // Function to center map on user location
  const centerMapOnUser = () => {
    if (userLocation && mapRef.current) {
      const zoomLevel = 0.005;
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        },
        1000
      );
      // Set flag that map has been manually positioned
      setMapManuallyPositioned(true);
    }
  };

  // Custom user location marker component
  const UserLocationMarker = () => (
    <Marker
      coordinate={userLocation}
      title="You are here"
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.userLocationContainer}>
        <AnimatedView
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={styles.userLocationOuter}
        >
          <View style={styles.userLocationInner} />
        </AnimatedView>
      </View>
    </Marker>
  );

  // Effect to clear selected marker when drawer closes
  useEffect(() => {
    if (!isDrawerOpen) {
      setSelectedMarker(null);
    }
  }, [isDrawerOpen]);

  // If no locations are provided, show a message
  if (!locations || locations.length === 0) {
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={mapRegion}
          customMapStyle={mapStyle}
          showsPointsOfInterest={false}
          showsBuildings={true}
          showsTraffic={true}
          showsIndoors={true}
          showsCompass={true}
          showsScale={true}
        >
          {userLocation && <UserLocationMarker />}
        </MapView>
        {!locationPermission && (
          <Text style={styles.noDataText}>No location data available</Text>
        )}
        {userLocation && (
          <TouchableOpacity
            style={styles.locateButton}
            onPress={centerMapOnUser}
          >
            <Ionicons name="locate" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        customMapStyle={mapStyle}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsCompass={false}
        showsScale={false}
        onRegionChangeComplete={() => {
          setMapManuallyPositioned(true);
        }}
      >
        {userLocation && <UserLocationMarker />}

        {locations &&
          locations.map((location, index) => {
            // Handle different data structures - some items might have location nested, others direct
            const lat = parseFloat(location.location?.lat || location.lat);
            const long = parseFloat(location.location?.long || location.long);

            // Skip invalid coordinates
            if (isNaN(lat) || isNaN(long)) {
              console.warn(
                `Invalid coordinates for location ${index}`,
                location
              );
              return null;
            }

            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: lat,
                  longitude: long,
                }}
                onPress={(e) => {
                  // Prevent event bubbling to map
                  e.stopPropagation();
                  setSelectedMarker(index);
                  onLocationSelect(location);
                }}
                title={
                  selectedMarker === index
                    ? location.name || location.title || `Location ${index + 1}`
                    : null
                }
                description={
                  selectedMarker === index
                    ? location.spotLocationInfo?.place_name ||
                      location.description ||
                      ""
                    : null
                }
              >
                {/* Custom marker image */}
                <Image
                  source={customMarker}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </Marker>
            );
          })}
      </MapView>

      {userLocation && (
        <TouchableOpacity style={styles.locateButton} onPress={centerMapOnUser}>
          <Ionicons name="locate" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  map: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  noDataText: {
    position: "absolute",
    top: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
    borderRadius: 5,
  },
  locateButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userLocationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  userLocationOuter: {
    height: 22,
    width: 22,
    borderRadius: 12000,
    backgroundColor: "rgba(0, 122, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
  },
  userLocationInner: {
    height: 18,
    width: 18,
    borderRadius: 600,
    backgroundColor: "rgb(0, 122, 255)",
  },
});

export default Map;
