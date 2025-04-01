// Required React and Navigation imports
import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";

// Import application pages/screens
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

// Initialize navigation containers
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * AuthStack - Handles the authentication flow of the application
 * Contains Login and Register screens in a stack navigation
 * @returns Stack Navigator component with auth screens
 */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

/**
 * MainTabs - Main navigation tabs shown after user authentication
 * Contains Spots (Home) and Profile screens in a bottom tab navigation
 * @returns Tab Navigator component with main app screens
 */
function MainTabs() {
  return (
    <Tab.Navigator>
      {/* Spots Tab - Shows coffee spots/locations */}
      <Tab.Screen
        name="Spots"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="cafe" color={color} size={16} />
          ),
          tabBarLabel: "Spots",
          tabBarLabelStyle: {
            fontFamily: "Poppins-Medium",
          },
        }}
      />
      {/* Profile Tab - Shows user profile information */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={14} />
          ),
          tabBarLabel: "Profile",
          tabBarLabelStyle: {
            fontFamily: "Poppins-Medium",
          },
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * App - Root component of the application
 * Handles font loading and main navigation structure
 * @returns The main application component
 */
export default function App() {
  // State to track if custom fonts are loaded
  const [fontsLoaded, setFontsLoaded] = useState(false);

  /**
   * loadFonts - Loads custom Poppins font family variants
   * Uses expo-font to load font files from assets
   */
  const loadFonts = useCallback(async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
      "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
      "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    });
    setFontsLoaded(true);
  }, []);

  // Load fonts when component mounts
  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  // Show nothing until fonts are loaded
  if (!fontsLoaded) {
    return null; // Or return a loading spinner
  }

  // Main app structure with navigation container
  return (
    <NavigationContainer>
      {/* Main stack navigator containing Auth and MainApp screens */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="MainApp" component={MainTabs} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
