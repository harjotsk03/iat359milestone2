import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

// Import pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ headerShown: true }}
        />
        <Tab.Screen
          name="Login"
          component={Login}
          options={{ headerShown: true }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: true }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
