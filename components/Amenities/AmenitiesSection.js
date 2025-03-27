import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Amenity from "./Amenity";
import LabeledAmenity from "./LabeledAmenity";

const AmenitiesSection = ({ location }) => {
  if (!location) return null;

  return (
    <View style={styles.amenitiesContainer}>
      <Text style={styles.sectionTitle}>Amenities</Text>

      {/* First row of amenities */}
      <View style={styles.amenitiesRow}>
        <Amenity
          iconName="wifi"
          isAvailable={location.wifi}
          availableText="Wifi Available"
          unavailableText="No Wifi"
        />
        <Amenity
          iconName="power"
          isAvailable={location.outlets}
          availableText="Outlets Available"
          unavailableText="No Outlets"
        />
      </View>

      {/* Second row of amenities */}
      <View style={styles.amenitiesRowAfter}>
        <Amenity
          iconName="fast-food-outline"
          isAvailable={location.foodDrink}
          availableText="Food & Drink Allowed"
          unavailableText="Food & Drink Not Allowed"
        />
        <Amenity
          iconName="pencil-outline"
          isAvailable={location.whiteboards}
          availableText="Whiteboards Available"
          unavailableText="No Whiteboards"
        />
      </View>

      {/* Third row of amenities */}
      <View style={styles.amenitiesRowAfter}>
        <Amenity
          iconName="people-outline"
          isAvailable={location.groupWork}
          availableText="Good for Group Work"
          unavailableText="Not Good for Group Work"
        />
        <Amenity
          iconName="card-outline"
          isAvailable={location.IDrequired}
          availableText="ID Required"
          unavailableText="No ID Required"
        />
      </View>

      {/* Labeled amenities */}
      <LabeledAmenity label="Lighting" iconName="sunny" value="Bright" />

      <LabeledAmenity
        label="Noise Level"
        iconName="volume-low"
        value="Moderate"
      />

      <LabeledAmenity
        label="Tables"
        iconName="grid-outline"
        value={
          location.tables === "Mixed"
            ? "Individual and Shared"
            : location.tables
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default AmenitiesSection;
