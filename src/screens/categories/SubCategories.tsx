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
import Loader from "../../components/AnimatedLoader";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const SubCategoryScreen = ({ navigation }) => {
  const { categoriesName, setCategoriesId } = useAuth();

  const [selected, setSelected] = useState(categoriesName || "T-shirt");
  const [categories, setCategories] = useState([]);
  const [subcategoriesId, setsubCategoriesID] = useState(1);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);

  const [subCategories, setSubCategories] = useState([]);

  // ✅ Fetch categories only once
  useEffect(() => {
    const getCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(`https://elegant-project.onrender.com/api/categories`);
        const data = await res.json();
        if (data.success && data.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    getCategories();
  }, []);

  // ✅ Fetch subcategories when category changes
  useEffect(() => {
    const getSubCategories = async () => {
      setLoadingSubcategories(true);
      try {
        const res = await fetch(
          `https://elegant-project.onrender.com/api/categories/${subcategoriesId}/subcategories`
        );
        const data = await res.json();
        if (data.success && data.data) {
          setSubCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    if (subcategoriesId) getSubCategories();
  }, [subcategoriesId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

    if (loading) {
    return (
      <SkeletonPlaceholder>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={{ flexDirection: "row", marginBottom: 20 }}>
            <View style={{ width: 80, height: 80, borderRadius: 8 }} />
            <View style={{ marginLeft: 10 }}>
              <View style={{ width: 120, height: 20, borderRadius: 4 }} />
              <View style={{ width: 80, height: 20, borderRadius: 4, marginTop: 6 }} />
            </View>
          </View>
        ))}
      </SkeletonPlaceholder>
    );
  }
  
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
      {loadingCategories ? (
        <Loader />
      ) : (
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
      )}

      {/* Body container */}
      <View style={styles.bodyContainer}>
        {/* Left Sidebar */}
        {loadingCategories ? (
          <Loader />
        ) : (
          <View style={styles.sidebar}>
            <FlatList
              data={categories}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const isSelected = selected === item.name;
                return (
                  <TouchableOpacity
                    style={[
                      styles.sidebarItem,
                      isSelected && styles.sidebarItemSelected,
                    ]}
                    onPress={() => {
                      setSelected(item.name);
                      setsubCategoriesID(item.id);
                    }}
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
          {loadingSubcategories ? (
            <Loader />
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
    borderRadius: 16,
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
