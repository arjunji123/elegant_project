// HomePage.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../Profile/AccountScreen";
import HomeContent from "./HomeContent";
import { View, Text, StyleSheet, Image } from "react-native";
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
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1c1c1c",
          borderTopWidth: 0,
          height: 80,          
           marginBottom: 10,
          paddingHorizontal: 20,
          marginLeft: 10,
          marginRight: 10,
          // borderRadius: 90,
        },
        tabBarStyle: {
          backgroundColor: "#1c1c1c",
          borderTopWidth: 0,
          height: 70, // make it shorter
          marginHorizontal: 10, // equal left/right spacing
          borderRadius: 50, // rounded pill shape
          position: "absolute", // floats above screen
          bottom: 10, // distance from bottom
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20, // optional
        },
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
          marginTop: 13, // center icons vertically
        },
        tabBarIcon: ({ focused }) => {
          let iconSource;

          switch (route.name) {
            case "Home":
              iconSource = focused
                ? require("../../assets/images/activehome.png")
                : require("../../assets/images/home.png");
              break;
            case "Profile":
              iconSource = focused
                ? require("../../assets/images/activeProfile.png")
                : require("../../assets/images/profile.png");
              break;
            case "Wishlist":
              iconSource = focused
                ? require("../../assets/images/activewishlist.png")
                : require("../../assets/images/wishlist.png");
              break;
            case "Categories":
              iconSource = focused
                ? require("../../assets/images/activecategories.png")
                : require("../../assets/images/categories.png");
              break;
          }

          return <Image source={iconSource} style={{ width: 36, height: 36 }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeContent} />
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
