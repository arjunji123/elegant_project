// FlashSale.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import { useIsFocused } from "@react-navigation/native";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}


const WishlistScreen: React.FC = ({ navigation }) => {
  const { productId, token } = useAuth()
  const isFocused = useIsFocused();

  const [activeCategory, setActiveCategory] = useState("Newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ h: 3, m: 38, s: 10 });
  const getWishlistProducts = async () => {
    try {
      const res = await fetch(
        `https://elegant-project.onrender.com/api/getallProducts?wishlist_is=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success && data.data) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Server Error:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getWishlistProducts();
    }
  }, [isFocused]);


  const toggleFavorite = async (productId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const res = await fetch(`https://elegant-project.onrender.com/api/add-wishlist`, {
        method: "post", // or PATCH depending on backend
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 👈 check token value
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      const text = await res.text(); // get raw text first
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text); // parse only if JSON
      } catch (parseErr) {
        console.error("JSON parse failed. Response was not JSON:", text);
        return;
      }

      console.log("Product updated:", data);

      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, wishlist_is: newStatus } : p
          )
        );
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
    }
  };
  console.log(token,'tokentoken')

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text style={styles.header}>My Wishlist</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("SearchProductScreen")}
          activeOpacity={0.8}
        >
          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={18}
              color="#838383"

            />
            <TextInput
              placeholder="Search here"
              // placeholderTextColor="#aaa"
              // style={styles.searchInput}
              onPress={() => navigation.navigate("SearchProductScreen")}
            />

          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Your List</Text>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        {/* {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, activeCategory === cat && styles.activeCategory]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))} */}
      </ScrollView>

      {/* Products */}
      <View style={styles.productsGrid}>
        {products.map((item) => (item.wishlist_is && (
          <View key={item.id} style={styles.productCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.images[0] }} style={styles.productImage} />
             <TouchableOpacity
                               style={[
                                 styles.wishlistBtn,
                                 { backgroundColor: item.wishlist_is ? "#ffffff" : "#000000ff" }
                               ]}
                               onPress={() => toggleFavorite(item.id, item.wishlist_is)} >
                               <Icon
                                 name={item.wishlist_is ? "heart" : "heart-outline"}
                                 size={22}
                                 color={item.wishlist_is ? "#000000" : "#ffffff"}  />
                             </TouchableOpacity>
            </View>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.priceRatingRow}>
              <Text style={styles.productPrice}>${item.price}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={14} color="gold" />
                <Text style={styles.ratingText}>{item.rating ?? "5"}</Text>
              </View>
            </View>
          </View>
        )

        ))}
      </View>
    </ScrollView>
  );

};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
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
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    // marginTop:10
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between", // pushes price left, rating right
    alignItems: "center",
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#010911",
    fontFamily: "Poppins"
  },

  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    // backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 15,
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
