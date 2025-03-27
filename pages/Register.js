import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import * as Font from "expo-font";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import studySpotrLogo from "../assets/studyspotrLogo.png";

const Register = () => {
  const loadFonts = useCallback(async () => {
    await Font.loadAsync({
      // Add your fonts here, for example:
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
      "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    });
    setFontsLoaded(true);
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    setPasswordRequirements({
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const navigation = useNavigation();

  const showAlert = (message) => {
    Alert.alert("Alert", message);
  };

  const getProfile = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store user profile in AsyncStorage
      await AsyncStorage.setItem("userProfile", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      showAlert(error.response?.data?.error || "Failed to fetch profile.");
      return null;
    }
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      hideErrorModal();
    }, 3000);
  };

  const hideErrorModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateInputs = () => {
    if (!fullName.trim()) {
      showErrorModal("Please enter your full name");
      return false;
    }
    if (!username.trim()) {
      showErrorModal("Please enter a username");
      return false;
    }
    if (!email.trim()) {
      showErrorModal("Please enter your email");
      return false;
    }
    if (!password.trim()) {
      showErrorModal("Please enter a password");
      return false;
    }
    if (!confirmPassword.trim()) {
      showErrorModal("Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      showErrorModal("Passwords do not match");
      return false;
    }
    return true;
  };

  const register = async () => {
    if (!validateInputs()) return;

    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`,
        {
          username,
          email,
          password,
          name: fullName,
          // Add optional social media fields if you want to collect them
          linkedIn: "",
          discord: "",
          instagram: "",
          twitter: "",
        }
      );

      if (data) {
        await AsyncStorage.setItem("userToken", data.token);
        // Optionally store user data
        await AsyncStorage.setItem(
          "userProfile",
          JSON.stringify({
            _id: data._id,
            username: data.username,
            email: data.email,
            name: data.name,
          })
        );

        navigation.navigate("MainApp");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Registration failed. Please try again.";
      showErrorModal(errorMsg);
      console.error("Registration failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Animated.View
        style={[
          styles.errorModal,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.errorText}>{errorMessage}</Text>
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <Image
            source={studySpotrLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Sign up to continue</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={16}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#6c757d"
                autoCapitalize="none"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="at-outline"
                size={16}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#6c757d"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={16}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#6c757d"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              {showPasswordRequirements && (
                <View style={styles.requirementsModal}>
                  <Text style={styles.requirementsTitle}>
                    Password must contain:
                  </Text>
                  <View style={styles.requirementRow}>
                    <Ionicons
                      name={
                        passwordRequirements.uppercase
                          ? "checkmark-circle"
                          : "close-circle"
                      }
                      size={16}
                      color={
                        passwordRequirements.uppercase ? "#28a745" : "#dc3545"
                      }
                    />
                    <Text style={styles.requirementText}>Uppercase letter</Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Ionicons
                      name={
                        passwordRequirements.lowercase
                          ? "checkmark-circle"
                          : "close-circle"
                      }
                      size={16}
                      color={
                        passwordRequirements.lowercase ? "#28a745" : "#dc3545"
                      }
                    />
                    <Text style={styles.requirementText}>Lowercase letter</Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Ionicons
                      name={
                        passwordRequirements.number
                          ? "checkmark-circle"
                          : "close-circle"
                      }
                      size={16}
                      color={
                        passwordRequirements.number ? "#28a745" : "#dc3545"
                      }
                    />
                    <Text style={styles.requirementText}>Number</Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Ionicons
                      name={
                        passwordRequirements.special
                          ? "checkmark-circle"
                          : "close-circle"
                      }
                      size={16}
                      color={
                        passwordRequirements.special ? "#28a745" : "#dc3545"
                      }
                    />
                    <Text style={styles.requirementText}>
                      Special character (!@#$%^&*)
                    </Text>
                  </View>
                </View>
              )}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color="#6c757d"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#6c757d"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setShowPasswordRequirements(false)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={16}
                    color="#6c757d"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#6c757d"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={16}
                  color="#6c757d"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.messageContainer}>
            <Text
              style={[
                styles.messageText,
                confirmPassword !== "" && {
                  color: passwordsMatch ? "#007bff" : "#dc3545",
                },
              ]}
            >
              {passwordsMatch ? "Passwords Match" : "Passwords Do Not Match"}
            </Text>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={register}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signupLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#343a40",
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: "#212529",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#6c757d",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 120,
    marginBottom: 16,
    paddingHorizontal: 15,
    paddingLeft: 20,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
    fontFamily: "Poppins-Regular",
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-start",
    marginBottom: 25,
    marginTop: 0,
  },
  forgotPasswordText: {
    color: "#007bff",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 120,
    alignItems: "center",
    marginBottom: 45,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#6c757d",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  signupLink: {
    color: "#007bff",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageText: {
    color: "transparent",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  requirementsModal: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
    color: "#212529",
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#6c757d",
  },
  errorModal: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 8,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});

export default Register;
