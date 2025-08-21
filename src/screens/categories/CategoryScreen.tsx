import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import Arrowleft from "../../assets/icons/Arrowleft.png";
import dress from "../../assets/icons/dress.png";
import pant from "../../assets/icons/pant.png";
import Hat from "../../assets/icons/cap.png";
import tshirt from "../../assets/icons/tshirt.png";
import other from "../../assets/icons/other.png";
import Icon from "react-native-vector-icons/Ionicons";
import AnimatedLoader from "../../components/AnimatedLoader";

const screenWidth = Dimensions.get("window").width;
const numColumns = 5;
const horizontalPadding = 24 * 2; // from container paddingHorizontal
const itemWidth = (screenWidth - horizontalPadding) / numColumns;

const CategoryScreen: React.FC = ({ navigation }) => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const addresstAuth = async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://elegantproject-production.up.railway.app/api/categories`, {
          method: "GET",
        });

        const text = await res.text();

        const data = JSON.parse(text);
        console.log("Response text:", data.data);
        if (data) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    addresstAuth()
    setLoading(false)
  })

  console.log(categories, "categoriescategories")

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Image source={Arrowleft} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>Categories</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search category"
          placeholderTextColor="#999"
        />
      </View>

      {/* ALL CATEGORIES */}
      {loading ? <AnimatedLoader visible={loading} size={50} color="#704F38" />
  : <View>
        <View>
          <View style={styles.headerRow}>
            <Text style={styles.subtitle}>All Categories</Text>
          </View>
          <FlatList
            data={categories}
            numColumns={5} // ✅ ensures 5 items per row
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <View style={styles.iconWrapper}>
                  <Image source={item.icon} style={styles.iconImage} resizeMode="contain" />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
            )}
          />
        </View>
        {/* TOP CATEGORIES */}

        <View>
          <View style={styles.headerRow}>
            <Text style={styles.subtitle}>Top Categories</Text>
          </View>
          <View style={styles.categoriesRow}>
            {categories && categories.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.categoryContainer}>
                <View style={styles.iconWrapper}>
                  <Image source={item.icon} style={styles.iconImage} resizeMode="contain" />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>}

    </View>
  );
};

export default CategoryScreen;

// ----------------- STYLES -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24, // works with FlatList
    paddingTop: 24,
    backgroundColor: "#fff",
  },

  // HEADER
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
    width: 29,
    height: 29,
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

  // SEARCH
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
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },

  // SECTION HEADER
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#010911",
    fontFamily: "Poppins",
  },

  // GRID (FlatList items)
  gridItem: {
    width: itemWidth,       // Explicit width for equal columns
    alignItems: "center",
    marginBottom: 20,       // vertical spacing only, no horizontal margin!
  },

  // TOP CATEGORIES ROW
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  categoryContainer: {
    alignItems: "center",
    marginVertical: 10,
    width: 80,
  },

  // ICONS & LABELS
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
  iconImage: {
    width: 28,
    height: 28,
  },
  categoryName: {
    fontSize: 12,
    color: "#6B4226",
    textAlign: "center",
  },
});
