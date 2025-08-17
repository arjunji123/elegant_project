// HomeContent.tsx
import React from "react";
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
import cart from "../../assets/images/Bag.png"

const HomeContent = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
<View style={styles.headerRow}>
  <View style={styles.leftContainer}>
    <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
      <Image source={avtar} style={styles.avatar} />
    </TouchableOpacity>
    <View>
      <Text style={styles.greeting}>Have a nice day!</Text>
      <Text style={styles.userName}>{user?.name}</Text>
    </View>
  </View>

  <TouchableOpacity style={styles.notificationButton}>
    <Image
      source={cart}
      style={styles.notificationIcon}
    />
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

        <TouchableOpacity style={styles.filterButton}>
          <Icon name="options-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <Image style={styles.DiscoutImage} source={DiscoutImage} />

      <CategoriesHome />
      <FlashSale/>
    </ScrollView>
  );
};

export default HomeContent;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 30, // extra space at bottom
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    top: 5,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "rgba(255, 0, 0, 0.3)", // light outer ring
    justifyContent: "center",
    alignItems: "center",
  },
  
  redDotInner: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: "red", // solid center
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
    resizeMode: 'cover', // scale the image properly
    borderRadius: 8, // optional rounded corners
    marginTop: 20,
  }
});
