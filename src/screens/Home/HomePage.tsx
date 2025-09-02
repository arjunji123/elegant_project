import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AccountScreen from "../Profile/AccountScreen";
import HomeContent from "./HomeContent";
import WishlistScreen from "../wishList/WishlistScreen";
import SubCategoryScreen from "../categories/SubCategories";

const Tab = createBottomTabNavigator();

const HomePage = () => {
    const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1c1c1c",
          borderTopWidth: 0,
          height: 70,
          marginHorizontal: 10,
          borderRadius: 50,
          position: "absolute",
         bottom: insets.bottom , 
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        },
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
          marginTop: 13,
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

          return <Image source={iconSource} style={{ width: 30, height: 30 }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeContent} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Categories" component={SubCategoryScreen} />
      <Tab.Screen name="Profile" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default HomePage;