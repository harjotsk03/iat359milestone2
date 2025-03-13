import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Map = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map View</Text>
      <Text>This is where the map will be displayed</Text>
      {/* You would integrate a map component here, like react-native-maps */}
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
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Map;
