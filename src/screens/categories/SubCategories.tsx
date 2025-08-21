import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import Arrowleft from "../../assets/icons/Arrowleft.png";
import dress from "../../assets/icons/dress.png";
import pant from "../../assets/icons/pant.png";
import Hat from "../../assets/icons/cap.png";
import tshirt from "../../assets/icons/tshirt.png";
import other from "../../assets/icons/other.png";
import Icon from "react-native-vector-icons/Ionicons";

const limitedCategories = [
  { id: "1", name: "T-Shirt", icon: tshirt },
  { id: "2", name: "Hoodies", icon: pant },
  { id: "3", name: "Dress", icon: dress },
  { id: "4", name: "Hat", icon: Hat },
  { id: "5", name: "Others", icon: other },
];

const allCategories = [
  { id: "1", name: "T-Shirt", icon: tshirt },
  { id: "2", name: "Hoodies", icon: pant },
  { id: "3", name: "Dress", icon: dress },
  { id: "4", name: "Hat", icon: Hat },
  { id: "5", name: "Others", icon: other },
  { id: "6", name: "Others", icon: other },
  { id: "7", name: "Others", icon: other },
  { id: "8", name: "Others", icon: other },
  { id: "9", name: "Others", icon: other },
];

const CategoryScreen = ({ navigation }) => {
  const [selected, setSelected] = useState("T-Shirt");
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>Categories</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search category"
          placeholderTextColor="#999"
        />
      </View>

      {/* Body container: horizontal split */}
      <View style={styles.bodyContainer}>
        {/* Left sidebar: limited category icons & names */}
        <View style={styles.sidebar}>
          <FlatList
            data={limitedCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selected === item.name;
              return (
                <TouchableOpacity
                  style={[
                    styles.sidebarItem,
                    isSelected && styles.sidebarItemSelected,
                  ]}
                  onPress={() => setSelected(item.name)}
                  activeOpacity={0.75}
                >
                  <View style={isSelected ? {} : styles.iconWrapper}>
                    <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                  </View>
                  <Text
                    style={[
                      styles.sidebarText
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Right panel: all categories as list with selected highlight */}
        <View style={styles.subCategoryPanel}>
          {allCategories.map((sub) => (
            <TouchableOpacity key={sub.id} style={styles.subCategoryRow} activeOpacity={0.7}>
              <Text >{sub.name}</Text>
              <Icon name="chevron-forward" size={18} color="#A5A5A5" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CategoryScreen;

const width = Dimensions.get("window").width;
const sidebarWidth = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "#fff",
  },
  header: {
    position: "relative",
    height: 40,
    justifyContent: "center",
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    color: "#000000",
    fontWeight: "normal",
    fontFamily: "Poppins",
    marginRight: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },

  bodyContainer: {
    flex: 1,
    flexDirection: "row"
  },

  sidebar: {
    alignItems: "center",
  },
  sidebarItem: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopLeftRadius:16,
    borderBottomLeftRadius:16,
    marginBottom: 10,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  iconWrapper: {
    backgroundColor: "#F7F2ED",
    padding: 12,
    borderRadius: 50,
    marginBottom: 5,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarItemSelected: {
    backgroundColor: "#FFEBD7",
    // alignItems: "center",
  },
  sidebarText: {
    fontSize: 14,
    color: "#272727",
    fontWeight: "500",
  },


  subCategoryPanel: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  subCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  subcategoryText: {
    flex: 1,
    fontSize: 14,
    color: "#202020",
    fontFamily: "Poppins",
  },
  chevron: {
    fontSize: 22,
    color: "#A7A7A7",
    marginLeft: 10,
    fontWeight: "bold",
  },
});
