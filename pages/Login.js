import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import * as Font from "expo-font";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import studySpotrLogo from "../assets/studyspotrLogo.png";

const Login = () => {
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const logIn = async () => {
    if (email === "" || password === "") {
      showAlert("Please enter your email and password!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data) {
        await AsyncStorage.setItem("userToken", data.token);

        // Fetch and store user profile after successful login
        const userProfile = await getProfile(data.token);

        navigation.navigate("MainApp");
      }
    } catch (error) {
      showAlert(
        error.response?.data?.error || "Login failed. Please try again."
      );
      console.error("Login failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
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

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
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
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#6c757d"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={logIn}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
});

export default Login;
