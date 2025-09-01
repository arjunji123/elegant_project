// FlashSale.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, GestureResponderEvent } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import { useIsFocused } from "@react-navigation/native";
import Button from "../../components/Button";
import Header from "../../components/Header";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}


const WishlistScreen: React.FC = ({ navigation }) => {
  const { setProductId, token } = useAuth()
  const isFocused = useIsFocused();
  const [categories, setCategories] = useState<any[]>([]);

  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ h: 3, m: 38, s: 10 });

useEffect(() => {
  const fetchWishlistProducts = async () => {
    try {
      let url = 'https://elegant-project.onrender.com/api/wishlist';

      if (activeCategory) {
        // Fetch products by activeCategory filtered wishlist items on client
        url = `https://elegant-project.onrender.com/api/product/category/${activeCategory}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success) {
        if (activeCategory) {
          // Filter only wishlist items if category-based
          const wishlisted = data.data.filter((item: any) => item.wishlist_is === 1);
          setProducts(wishlisted);
        } else {
          setProducts(data.products); // For wishlist endpoint
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Server Error:", error);
      setProducts([]);
    }
  };

  fetchWishlistProducts();

}, [activeCategory, token]);

  // useEffect(() => {
  //   const categoriesProduct = async () => {
  //     try {
  //       const res = await fetch(
  //         `https://elegant-project.onrender.com/api/product/category/${activeCategory}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: token ? `Bearer ${token}` : "",
  //           },
  //         }
  //       );

  //       const text = await res.text();
  //       const data = JSON.parse(text);

  //       if (data.success && data.data) {
  //         const wishlisted = data.data.filter(
  //           (item: any) => item.wishlist_is === 1
  //         );
  //         setProducts(wishlisted);
  //       } else {
  //         setProducts([]);
  //       }
  //     } catch (error) {
  //       console.error("Server Error:", error);
  //     }
  //   }
  //   categoriesProduct()
  // }, [activeCategory])

  const fetchCategories = async () => {

    try {
      const res = await fetch(
        `https://elegant-project.onrender.com/api/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "", // ✅ token added here
          },
        }
      );
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Categories fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [])

  // useEffect(() => {
  //  getWishlistProducts();
  // },);
  
  const toggleFavorite = async (productId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    console.log(productId, 'productIdproductId')
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
  const handleGoBack = () => navigation.goBack();

  return (
    <ScrollView style={styles.scrollContainer}

      contentContainerStyle={styles.scrollContent}    >
      <Header text={"My Wishlist"} onPress={handleGoBack} />

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
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, activeCategory === cat.id && styles.activeCategory]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={[styles.categoryText, activeCategory === cat.id && styles.activeCategoryText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products */}
      <View style={styles.productsGrid}>
        {products.map((item) => (item &&

          (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => { navigation.navigate("ProductDetailScreen"), setProductId(item.id) }}>

                  <Image source={{ uri: item.images[0].url ? item.images[0].url : item.images[0] }} style={styles.productImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.wishlistBtn,
                    { backgroundColor: "#ffffff" }
                  ]}
                  onPress={() => toggleFavorite(item.id, item.wishlist_is)} >
                  <Icon
                    name='heart'
                    size={22}
                    color='#000000ff' />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => { navigation.navigate("ProductDetailScreen"), setProductId(item.id) }}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
              <View style={styles.priceRatingRow}>
                <TouchableOpacity onPress={() => { navigation.navigate("ProductDetailScreen"), setProductId(item.id) }}>

                  <Text style={styles.productPrice}>₹{item.price}</Text>
                </TouchableOpacity>
                <View style={styles.ratingRow}>
                  <Icon name="star" size={14} color="gold" />
                  <Text style={styles.ratingText}>{item.rating ?? "5"}</Text>
                </View>
              </View>
            </View>
          )

        ))}
        {products.length == 0 &&
          <><View style={{ flex: 1, justifyContent: "center", marginTop:50,alignItems: "center" }}>
            <Text style={styles.header}>No Products</Text>

            <TouchableOpacity style={{ marginTop: 20 }}>
              <Button
                text={"Products"}
                onPress={() => navigation.navigate("FilteredProductsScreen")}
                bgColor={"#704F38"}
                textColor={"#ffffff"}
              />
            </TouchableOpacity>
          </View></>
        }
      </View>
    </ScrollView>
  );

};

export default WishlistScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 100, // extra space at bottom
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
   
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between", // pushes price left, rating right
    alignItems: "center",
    marginTop: 4,
  },
  title: {
    margin: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#010911",
    fontFamily: "Poppins"
  },

  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderRadius: 20,
    marginRight: 8,
    borderColor: "#AFAFAF",
  },
  activeCategory: {
    backgroundColor: "#704F38",
    borderWidth: 0,
  },
  categoryText: {
    fontSize: 13,
    color: "#000",
    fontWeight: 500
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
    width: "48%",   // 2 per row
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },

  productImage: {
    width: 180,
    height: 200,
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