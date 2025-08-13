// HomePage.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../Profile/AccountScreen";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import HomeContent from "./HomeContent";

const Tab = createBottomTabNavigator();

function WishlistScreen() {
  return (
    <View style={styles.center}>
      <Text>Wishlist Screen</Text>
    </View>
  );
}

function CategoriesScreen() {
  return (
    <View style={styles.center}>
      <Text>Categories Screen</Text>
    </View>
  );
}

const HomePage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#704F38",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarStyle: {
          backgroundColor: "#1c1c1c",
          borderTopWidth: 0,
          height: 70,
          marginBottom:10,
          padding: 20,
          marginLeft:10,
          marginRight:10,
          borderRadius: 50,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Profile") iconName = "person-outline";
          else if (route.name === "Wishlist") iconName = "heart-outline";
          else if (route.name === "Categories") iconName = "grid-outline";

          return <Icon name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeContent}  />      
      <Tab.Screen name="Wishlist" component={WishlistScreen} />      
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
