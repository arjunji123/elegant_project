import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

import dress from "../../assets/icons/dress.png"
import pant from "../../assets/icons/pant.png"
import Hat from "../../assets/icons/cap.png"
import tshirt from "../../assets/icons/tshirt.png"
import other from "../../assets/icons/other.png"

const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / 5 - 10; // adjust for padding/margin

const CategoriesHome: React.FC = () => {
  const categories = [
    { id: '1', name: 'T-Shirt', icon: tshirt },
    { id: '2', name: 'Hoodies', icon: pant },
    { id: '3', name: 'Dress', icon: dress },
    { id: '4', name: 'Hat', icon: Hat },
    { id: '5', name: 'Others', icon: other },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Category</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Categories with wrapping */}
      <View style={styles.categoriesRow}>
        {categories.map((item) => (
          <View key={item.id} style={styles.categoryContainer}>
            <View style={styles.iconWrapper}>
              <Image source={item.icon} style={styles.iconImage} resizeMode="contain" />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
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
  categoriesRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-around' 
  },
  categoryContainer: { 
    alignItems: 'center', 
    marginVertical: 10, 
    width: itemSize 
  },
  iconWrapper: {
    backgroundColor: '#F7F2ED',
    padding: 12,
    borderRadius: 50,
    marginBottom: 5,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconImage: {
    width: 28,
    height: 28
  },
  categoryName: { fontSize: 12, color: '#6B4226', textAlign: 'center' },
});
