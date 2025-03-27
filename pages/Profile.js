import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import defaultProfile from "../assets/defaultProfile.jpg";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function Profile({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    phoneNumber: "",
  });

  const pickImage = async () => {
    setSelectedImage(null);
    setImageUrl(null);
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      const imageUri = pickerResult.assets[0].uri;
      setSelectedImage(imageUri);
      updateProfilePhoto(imageUri);
    }
  };

  useEffect(() => {
    console.log(userProfile?._id);
  }, [userProfile]);

  const updateProfilePhoto = async (imageUri) => {
    try {
      // Create form data
      const formData = new FormData();

      // Get the image name from URI
      const imageName = imageUri.split("/").pop();

      // Add the image to form data
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg", // or appropriate mime type
        name: imageName,
      });

      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/updateProfilePhoto/${userProfile?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Update the local user profile with new image URL
        const updatedProfile = {
          ...userProfile,
          profilePhoto: response.data.imageUrl,
        };
        setUserProfile(updatedProfile);
        await AsyncStorage.setItem(
          "userProfile",
          JSON.stringify(updatedProfile)
        );
        console.log("Profile photo updated successfully");
      }
    } catch (error) {
      console.error("Failed to update profile photo:", error);
    }
  };

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

  const startEditing = () => {
    setEditForm({
      name: userProfile?.name || "",
      username: userProfile?.username || "",
      phoneNumber: userProfile?.phoneNumber || "",
    });
    setIsEditing(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/updateUser/${userProfile?._id}`,
        editForm
      );

      if (response.status === 200) {
        // Update local state with new data
        const updatedProfile = {
          ...userProfile,
          ...response.data.user,
        };
        setUserProfile(updatedProfile);
        await AsyncStorage.setItem(
          "userProfile",
          JSON.stringify(updatedProfile)
        );
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
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
            source={
              userProfile?.profilePhoto
                ? { uri: userProfile.profilePhoto }
                : defaultProfile
            }
            style={styles.profilePhoto}
          />
          <TouchableOpacity style={styles.editButton} onPress={pickImage}>
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
          {!isEditing ? (
            <>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{userProfile?.name}</Text>

              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>{userProfile?.username}</Text>

              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>
                {userProfile?.phoneNumber || "Not connected"}
              </Text>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{userProfile?.email}</Text>

              <TouchableOpacity
                style={styles.editButton}
                onPress={startEditing}
              >
                <Ionicons
                  name="pencil"
                  size={20}
                  color="gray"
                  style={styles.icon}
                />
                <Text style={styles.editButtonText}>Edit details</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, name: text }))
                }
                placeholder="Enter your name"
              />

              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={editForm.username}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, username: text }))
                }
                placeholder="Enter your username"
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editForm.phoneNumber}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, phoneNumber: text }))
                }
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.editButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleUpdateProfile}
                >
                  <Text style={[styles.editButtonText, styles.saveButtonText]}>
                    Save Changes
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
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
    fontFamily: "Poppins-SemiBold",
    marginTop: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-Medium",
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
    fontFamily: "Poppins-Regular",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-SemiBold",
  },
  linkValue: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#007BFF",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    flex: 1,
    marginLeft: 10,
  },
  saveButtonText: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
  },
});
