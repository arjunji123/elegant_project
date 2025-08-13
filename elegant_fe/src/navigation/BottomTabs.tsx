import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomePageScreen from "../screens/Home/HomePage"
import ProfileScreen from "../screens/Profile/AccountScreen"

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
export default function BottomTabs() {
  return (
    <><Text>Sonal</Text><Tab.Navigator
          screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: 'blue',
              tabBarInactiveTintColor: 'gray',
          }}
      >
          <Tab.Screen name="HomePageScreen" component={HomePageScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Wishlist" component={WishlistScreen} />
          <Tab.Screen name="Categories" component={CategoriesScreen} />
      </Tab.Navigator></>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
