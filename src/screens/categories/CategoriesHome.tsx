import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useAuth } from "../../Context/AuthContext";

const screenWidth = Dimensions.get('window').width;

const CategoriesHome = ({ navigation }) => {
  const { setCategoriesName } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(`https://elegant-project.onrender.com/api/categories`, { method: "GET" });
        const data = await res.json();
        if (data.success && data.data) {
          setCategories(data.data.slice(0, 5)); // show max 5 categories
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  // Calculate width so all items fit in one row
  const itemWidth = screenWidth / (categories.length || 1) - 15; // 15 for padding/margin

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Category</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SubCategoriesScreen")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Row */}
      <View style={styles.categoriesRow}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              setCategoriesName(item.name);
              navigation.navigate("SubCategoriesScreen");
            }}
            style={[styles.categoryContainer, { width: itemWidth }]}
          >
            <View style={styles.iconWrapper}>
              <Image source={{ uri: item.icon }} style={styles.iconImage} resizeMode="contain" />
            </View>
            <Text style={styles.categoryName} numberOfLines={1} 
  ellipsizeMode="tail">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CategoriesHome;

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '600', color: '#000' },
  seeAll: { fontSize: 14, color: '#6B4226' },
  categoriesRow: { flexDirection: 'row' }, // one row
  categoryContainer: { alignItems: 'center', marginVertical: 8 },
  iconWrapper: {
    backgroundColor: '#F7F2ED',
    padding: 12,
    borderRadius: 50,
    marginBottom: 5,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: { width: 28, height: 28 },
  categoryName: { fontSize: 11, color: '#6B4226', textAlign: 'center', fontWeight:500 },
});
