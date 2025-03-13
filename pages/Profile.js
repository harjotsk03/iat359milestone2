import React from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const handleButtonClick = (buttonName) => {
    console.log(`${buttonName} button has been clicked`);
  };

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>
      <Text style={styles.subtitle}>Your Profile Details at a Glance</Text>

      {/* Basic Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        {/* Profile Photo */}
        <View style={styles.profilePhotoContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }} 
            style={styles.profilePhoto}
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleButtonClick("Edit Profile Photo")}
          >
            <Ionicons name="pencil" size={20} color="white" style={styles.icon} />
            <Text style={styles.editButtonText}>Edit Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* User Details */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>Faaiz Abdullah</Text>

          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>faaizjd</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleButtonClick("Edit Profile Info")}
          >
            <Ionicons name="pencil" size={20} color="white" style={styles.icon} />
            <Text style={styles.editButtonText}>Edit details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Social Media Connections */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Social Media Connections</Text>

        <Text style={styles.label}>Instagram</Text>
        <TouchableOpacity onPress={() => openLink("https://instagram.com/faaiz.jd")}> 
          <Text style={styles.linkValue}>faaiz.jd</Text>
        </TouchableOpacity>

        <Text style={styles.label}>LinkedIn</Text>
        <TouchableOpacity onPress={() => openLink("https://linkedin.com/in/faaiz-abdullah-9004391a4")}> 
          <Text style={styles.linkValue}>faaiz-abdullah-9004391a4</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Discord</Text>
        <TouchableOpacity onPress={() => openLink("https://discord.com/users/faaizja")}> 
          <Text style={styles.linkValue}>faaizja</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Discover Your Study Type</Text>

        <Text style={styles.paragraph}>Unlock personalized study spot recommendations based on your unique study style. 
          Whether you thrive in quiet corners or lively cafes, this quiz will help you find the perfect match!
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profilePhotoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#ECECEC",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    color: "#00000",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  infoContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  linkValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
});
