import React, { useEffect, useState } from "react";
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
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import Skeleton from "../../components/Skeleton";
import Header from "../../components/Header";

const SubCategoryScreen = ({ navigation }) => {
  const { categoriesName, setCategoriesId } = useAuth();

  // State to hold the fetched categories, which include nested subcategories
  const [categories, setCategories] = useState([]);
  
  // State to hold the subcategories of the currently selected category
  const [subCategories, setSubCategories] = useState([]);

  // State to track the currently selected category name
  const [selectedCategoryName, setSelectedCategoryName] = useState(categoriesName || "T-shirt");

  // State for loading indicators
  const [loadingCategories, setLoadingCategories] = useState(true);

  // We can derive the selected category object based on the selected name
  const selectedCategory = categories.find(
    (cat) => cat.name === selectedCategoryName
  );

  // ✅ Fetch categories and their nested subcategories in a single API call
  useEffect(() => {
    const getCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(
          `https://elegant-project.onrender.com/api/categories-with-subcategories`
        );
        const data = await res.json();
        if (data.success && data.data) {
          setCategories(data.data);
          
          // Find the initial subcategories based on the pre-selected name
          const initialCategory = data.data.find(
            (cat) => cat.name === selectedCategoryName
          );
          if (initialCategory) {
            setSubCategories(initialCategory.subcategories);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    getCategories();
  }, []); // Run only once on component mount

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCategoryPress = (category) => {
    // Update the selected category name and the subcategories displayed
    setSelectedCategoryName(category.name);
    setSubCategories(category.subcategories);
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <Header text={"Categories List"} onPress={handleGoBack}/>

      {/* <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>Categories List</Text>
      </View> */}

      {/* Search */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("SearchProductScreen")}
          activeOpacity={0.8}
        >
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#838383" />
            <TextInput
              placeholder="Search here"
              editable={false}
              pointerEvents="none"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Body container */}
       <Text style={styles.allCategories}>All Categories</Text>
      <View style={styles.bodyContainer}>
        {/* Left Sidebar (Categories) */}
       
        {loadingCategories ? (
          <View style={styles.sidebar}>
            <Skeleton width={50} height={50} borderRadius={10} style={{ marginRight: 10, marginTop: 10 }} />
            <Skeleton width={50} height={50} borderRadius={10} style={{ marginRight: 10, marginTop: 10 }} />
            <Skeleton width={50} height={50} borderRadius={10} style={{ marginRight: 10, marginTop: 10 }} />
            <Skeleton width={50} height={50} borderRadius={10} style={{ marginRight: 10, marginTop: 10 }} />
            <Skeleton width={50} height={50} borderRadius={10} style={{ marginRight: 10, marginTop: 10 }} />
            <Skeleton width={50} height={50} borderRadius={10} style={{ marginRight: 10, marginTop: 10 }} />
            <Skeleton width={50} height={50} borderRadius={10} style={{ marginRight: 10, marginTop: 10 }} />
          </View>
        ) : (
          <View style={styles.sidebar}>
            <FlatList
              data={categories}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const isSelected = selectedCategoryName === item.name;
                return (
                  <TouchableOpacity
                    style={[
                      styles.sidebarItem,
                      isSelected && styles.sidebarItemSelected,
                    ]}
                    onPress={() => handleCategoryPress(item)}
                    activeOpacity={0.75}
                  >
                    <View style={isSelected ? {} : styles.iconWrapper}>
                      <Image
                        source={{ uri: item.icon }}
                        style={styles.icon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.sidebarText}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Right Subcategories */}
        <View style={styles.subCategoryPanel}>
          {loadingCategories ? ( // Use the same loading state for both panels
            <View style={{ padding: 20 }}>
              <Skeleton width="80%" height={20} borderRadius={6} style={{ marginTop: 12 }} />
              <Skeleton width="80%" height={20} borderRadius={6} style={{ marginTop: 12 }} />
              <Skeleton width="80%" height={20} borderRadius={6} style={{ marginTop: 12 }} />
              <Skeleton width="80%" height={20} borderRadius={6} style={{ marginTop: 12 }} />
              <Skeleton width="80%" height={20} borderRadius={6} style={{ marginTop: 12 }} />
              <Skeleton width="80%" height={20} borderRadius={6} style={{ marginTop: 12 }} />
            </View>
          ) : (
            subCategories.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={styles.subCategoryRow}
                activeOpacity={0.7}
                onPress={() => {
                  setCategoriesId(sub.category_id);
                  navigation.navigate("ProductScreen");
                }}
              >
                <Text>{sub.name}</Text>
                <Icon name="chevron-forward" size={18} color="#A5A5A5" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

export default SubCategoryScreen;

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
    height: 40,
    justifyContent: "center",
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { padding: 8 },
  backIcon: { width: 24, height: 24, resizeMode: "contain" },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    color: "#000",
    marginRight: 40,
  },
    allCategories: {
    margin:10,
    fontSize: 16,
    color: "#000",
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    flex: 1,
    height: 44,
  },
  icon: { width: 24, height: 24, resizeMode: "contain" },
  input: { flex: 1, fontSize: 14, color: "#000" },
  bodyContainer: { flex: 1, flexDirection: "row" },
  sidebar: { alignItems: "center" },
  sidebarItem: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,

    marginBottom: 10,
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
  sidebarItemSelected: { backgroundColor: "#FFEBD7" },
  sidebarText: { fontSize: 14, color: "#272727", fontWeight: "500" },
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
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
});
