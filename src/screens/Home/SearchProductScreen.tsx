// SearchProductScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SearchProductScreen = () => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Search Product</Text>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search category"
          placeholderTextColor="#999"
          autoFocus={true}
        />
      </View>

    </View>
  );
};

export default SearchProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
});
