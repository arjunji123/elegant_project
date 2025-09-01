// HomeContent.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import avtar from "../../assets/images/avatar.png";
import DiscoutImage from "../../assets/images/DiscoutImage.png";
import CategoriesHome from "../categories/CategoriesHome";
import FlashSale from "../product/FlashSale";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const HomeContent = ({ navigation }) => {

  const { user, token } = useAuth();
  const isFocused = useIsFocused();

  const [profilePic, setProfilePic] = useState(null);
  const userId = user?.id || "123";
  useEffect(() => {
       if (isFocused) {
         let mounted = true;
    const testAuth = async () => {
      try {
        // show loader when fetch starts

        const res = await fetch(`https://elegant-project.onrender.com/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        const data = JSON.parse(text);
        if (data.success && data.data && mounted) {

          setProfilePic(data.data.profile_pic);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (token && userId) {
      testAuth();
    }
    return () => {
      mounted = false;
    };
       }
   
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      const clearFilters = async () => {
        await AsyncStorage.removeItem("userFilters");
        console.log("✅ Filters cleared when Home screen is focused");
      };
      clearFilters();
    }, [])
  );
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
            <Image source={profilePic ? { uri: profilePic } : avtar} style={styles.avatar} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Have a nice day!</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.notificationButton}>
          {/* <Image
      source={cart}
      style={styles.notificationIcon}
    /> */}
          <Icon
            name="bag-outline"
            size={32}
            color="#000000ff"
            style={{ marginHorizontal: 8 }}
          />
          <Text style={styles.colon}>:</Text>

          <View style={styles.redDotWrapper}>
            <View style={styles.redDotInner} />
          </View>
        </TouchableOpacity>
      </View>


      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("SearchProductScreen")}
          activeOpacity={0.8}
        >
          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={18}
              color="#aaa"
              style={{ marginHorizontal: 8 }}
            />
            <TextInput
              // placeholder="Search here"
              // placeholderTextColor="#aaa"
              // style={styles.searchInput}
              onPress={() => navigation.navigate("SearchProductScreen")}
            />

          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate("AdvanceFilterScreen")}>
          <Icon name="options-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('DiscountProductScreen')}>
        <Image style={styles.DiscoutImage} source={DiscoutImage} />
      </TouchableOpacity>
      <CategoriesHome navigation={navigation} />
      <FlashSale navigation={navigation} />
    </ScrollView>
  );
};

export default HomeContent;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 100, // extra space at bottom
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  notificationIcon: {
    width: 34,
    height: 32,
    tintColor: "#000",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  greeting: {
    fontSize: 14,
    color: "#777",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },

  redDotWrapper: {
    position: "absolute",
    top: 8,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#FFC4C4", // light outer ring
    justifyContent: "center",
    alignItems: "center",
  },
  blackDot: {
    position: "absolute",
    backgroundColor: "#1D1E20",
    top: 23,
    width: 3,
    height: 3,
    borderRadius: 5,
  },
  colon: {
    position: "absolute",
    right: 15,   // adjust to move
    top: 8,     // adjust to move
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    transform: [{ rotate: "90deg" }], // 🔹 rotates colon
  },
  redDotInner: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#DC1010", // solid center
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 6,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    flex: 1,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  filterButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 8,
    elevation: 2,
  },
DiscoutImage: {
  width: '100%',
  resizeMode: 'cover',
  borderRadius: 8,
  marginTop: 20,
  alignSelf: "center",
}

});
