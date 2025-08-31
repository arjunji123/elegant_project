// SearchProductScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import Arrowleft from "../../assets/icons/Arrowleft.png";
import Header from "../../components/Header";


const SearchProductScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const { setQuery } = useAuth();

  const handleSearch = () => {
    if (search.trim() !== "") {
      setQuery(search);
      navigation.navigate("SearchResultScren");
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      {/* Title */}
      <Header text={"Search Product"} onPress={handleGoBack} />

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search-outline" size={18} color="#999" style={styles.icon} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Search category"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          autoFocus={true}
          returnKeyType="search"   // show "Search" on keyboard
          onSubmitEditing={handleSearch} // trigger search on enter
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
