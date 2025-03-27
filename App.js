import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";

// Import pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Add this function to handle authentication flow
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

// This component will be shown after login
function MainTabs() {
  return (
    <Tab.Navigator>
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
      {/* <Tab.Screen
        name="Community"
        component={Profile}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" color={color} size={14} />
          ),
          tabBarLabel: "Community",
        }}
      /> */}
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

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = useCallback(async () => {
    await Font.loadAsync({
      "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
      "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
      "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    });
    setFontsLoaded(true);
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  if (!fontsLoaded) {
    return null; // Or return a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="MainApp" component={MainTabs} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
