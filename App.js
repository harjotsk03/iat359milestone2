import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";

// Import pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
