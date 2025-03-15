import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Load user profile data when component mounts
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

  const handleButtonClick = (buttonName) => {
    console.log(`${buttonName} button has been clicked`);
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const extractUsername = (url, platform) => {
    // Remove trailing slash if present
    const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;

    // Split the URL by '/' and get the last segment
    const lastSegment = cleanUrl.split("/").pop();

    // Handle platform-specific URL patterns
    switch (platform.toLowerCase()) {
      case "instagram":
        return lastSegment || "instagram_user";
      case "linkedin":
        // LinkedIn URLs might contain additional parameters
        return lastSegment.split("?")[0] || "linkedin_user";
      case "discord":
        // Discord usernames might include the discriminator
        return lastSegment || "discord_user";
      default:
        return lastSegment || "username";
    }
  };

  const handleLogout = async () => {
    try {
      // Remove the token and user profile from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userProfile");

      // Navigate to the Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
            source={{ uri: userProfile?.profilePhoto }}
            style={styles.profilePhoto}
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleButtonClick("Edit Profile Photo")}
          >
            <Ionicons
              name="pencil"
              size={20}
              color="gray"
              style={styles.icon}
            />
            <Text style={styles.editButtonText}>Edit Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* User Details */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userProfile?.name}</Text>

          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{userProfile?.username}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userProfile?.email}</Text>

          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>{userProfile?.phoneNumber}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleButtonClick("Edit Profile Info")}
          >
            <Ionicons
              name="pencil"
              size={20}
              color="gray"
              style={styles.icon}
            />
            <Text style={styles.editButtonText}>Edit details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Social Media Connections */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Social Media Connections</Text>

        <Text style={styles.label}>Instagram</Text>
        <TouchableOpacity onPress={() => openLink(userProfile?.instagram)}>
          <Text style={styles.linkValue}>
            {userProfile?.instagram
              ? extractUsername(userProfile?.instagram, "instagram")
              : "Not connected"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>LinkedIn</Text>
        <TouchableOpacity onPress={() => openLink(userProfile?.linkedIn)}>
          <Text style={styles.linkValue}>
            {userProfile?.linkedIn
              ? extractUsername(userProfile?.linkedIn, "linkedin")
              : "Not connected"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Discord</Text>
        <TouchableOpacity onPress={() => openLink(userProfile?.discord)}>
          <Text style={styles.linkValue}>
            {userProfile?.discord
              ? extractUsername(userProfile?.discord, "discord")
              : "Not connected"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Discover Your Study Type</Text>

        <Text style={styles.paragraph}>
          Unlock personalized study spot recommendations based on your unique
          study style. Whether you thrive in quiet corners or lively cafes, this
          quiz will help you find the perfect match!
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={20}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
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
    borderRadius: 500,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    color: "#00000",
  },
  editButtonText: {
    color: "#000000",
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
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
