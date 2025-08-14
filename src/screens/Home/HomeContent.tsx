// HomeContent.tsx
import React from "react";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import avtar from "../../assets/images/avatar.png";
import DiscoutImage from "../../assets/images/DiscoutImage.png";

const HomeContent = ({navigation}) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer} >
      <TouchableOpacity onPress={()=>navigation.navigate('ProfileScreen')}>
        <Image source={avtar} style={styles.avatar} />
        </TouchableOpacity>
        <View>
          <Text style={styles.greeting}>Have a nice day!</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.notificationButton} >
        <Image
          source={{ uri: "https://img.icons8.com/ios-filled/50/shopping-bag.png" }}
          style={styles.notificationIcon}
        />
        <View style={styles.redDot} />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#aaa" style={{ marginHorizontal: 8 }} />
        <TextInput placeholder="Search here" placeholderTextColor="#aaa" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="options-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <Image style={styles.DiscoutImage} source={DiscoutImage} />
    </View>
  );
};

export default HomeContent;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flex: 1,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
    fontWeight: "bold",
    color: "#000",
  },
  notificationButton: {
    position: "absolute",
    right: 20,
    top: 45,
  },
  notificationIcon: {
    width: 30,
    height: 30,
    tintColor: "#000",
  },
  redDot: {
    position: "absolute",
    right: 2,
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingVertical: 6,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 8,
    elevation: 2,
  },
  DiscoutImage: {
    marginTop: 20,
  },
});
