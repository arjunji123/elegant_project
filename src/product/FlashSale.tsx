// FlashSale.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import redDress from "../../assets/images/redDress.png"

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

const categories = ["All Items", "Newest", "T-shirt", "Pants", "Shoes"];

const FlashSale: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ h: 3, m: 38, s: 10 });

  useEffect(() => {
    setProducts([ { id: "1", name: "Modern Light Clothes", price: 212.99, image: "https://images.squarespace-cdn.com/content/v1/5911f31c725e251d002da9ac/1613210424136-AS3MY547OBB5Y3GSQ359/Product+Photography", rating: 5.0, },
     { id: "2", name: "Light Dress Bless", price: 162.99, image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fmodels-red&psig=AOvVaw1AhHJWdo_Nf_r3mVBf6FcH&ust=1755289568697000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOCUqKyRi48DFQAAAAAdAAAAABAL", rating: 5.0, }, 
     { id: "3", name: "Maroon Dark Top", price: 199.99, image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fmodels-red&psig=AOvVaw1AhHJWdo_Nf_r3mVBf6FcH&ust=1755289568697000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOCUqKyRi48DFQAAAAAdAAAAABAL", rating: 5.0, }, 
     { id: "4", name: "Light Dress Yellow", price: 129.99, image: "https://images.squarespace-cdn.com/content/v1/5911f31c725e251d002da9ac/1613210424136-AS3MY547OBB5Y3GSQ359/Product+Photography", rating: 5.0, },
     { id: "5", name: "Light Dress Yellow", price: 129.99, image: "https://images.squarespace-cdn.com/content/v1/5911f31c725e251d002da9ac/1613210424136-AS3MY547OBB5Y3GSQ359/Product+Photography", rating: 5.0, }, 
    { id: "6", name: "Light Dress Yellow", price: 129.99, image: "https://images.squarespace-cdn.com/content/v1/5911f31c725e251d002da9ac/1613210424136-AS3MY547OBB5Y3GSQ359/Product+Photography", rating: 5.0, }, 
    { id: "7", name: "Light Dress Yellow", price: 129.99, image: "https://images.squarespace-cdn.com/content/v1/5911f31c725e251d002da9ac/1613210424136-AS3MY547OBB5Y3GSQ359/Product+Photography", rating: 5.0, },
    { id: "8", name: "Light Dress Yellow", price: 129.99, image: "https://images.squarespace-cdn.com/content/v1/5911f31c725e251d002da9ac/1613210424136-AS3MY547OBB5Y3GSQ359/Product+Photography", rating: 5.0, }, 
    { id: "9", name: "Light Dress Yellow", price: 129.99, image: "https://images.squarespace-cdn.com/content/v1/5911f31c725e251d002da9ac/1613210424136-AS3MY547OBB5Y3GSQ359/Product+Photography", rating: 5.0, }, ]); }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) {
          m--;
          s = 59;
        } else if (h > 0) {
          h--;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Flash sale</Text>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{String(timeLeft.h).padStart(2, "0")}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.timerText}>{String(timeLeft.m).padStart(2, "0")}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.timerText}>{String(timeLeft.s).padStart(2, "0")}</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, activeCategory === cat && styles.activeCategory]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products */}
      <View style={styles.productsGrid}>
        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <TouchableOpacity style={styles.wishlistBtn}>
                <Icon name="heart-outline" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color="gold" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FlashSale;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:20,
    // marginTop:10
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color:"#010911",
    fontFamily:"Poppins"
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    backgroundColor: "#ED3939",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 20,
    fontWeight: "bold",
    fontSize: 12,
  },
  colon: {
    marginHorizontal: 6,
    fontWeight: "bold",
    fontSize: 14,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategory: {
    backgroundColor: "#8B5E3C",
  },
  categoryText: {
    fontSize: 13,
    color: "#000",
  },
  activeCategoryText: {
    color: "#fff",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#fff",
    width: "48%",
    marginBottom: 15,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  wishlistBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 2,
    color: "#555",
  },
});
