// FlashSale.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, GestureResponderEvent, } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import Loader from "../../components/AnimatedLoader";
import AnimatedLoader from "../../components/AnimatedLoader";
const redDress = "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059417/products/kqnhfrcvlcs9b3nxy5fg.png"

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

// const categories = ["All Items", "Newest", "T-shirt", "Pants", "Shoes"];

const FlashSale = ({ navigation, refreshKey }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ h: 3, m: 38, s: 10 });
  const [categories, setCategories] = useState<any[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]); // shown items
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
   const pageSize = 4;
  const { setProductId, token } = useAuth()
  useEffect(() => {
    const getProduct = async () => {
      try {
        let url = "";
setLoading(true)
        switch (activeCategory) {
          case "all":
            url = "https://elegant-project.onrender.com/api/getallProducts";
            break;

          case "newest":
            url = "https://elegant-project.onrender.com/api/getallProducts";
            break;

          default:
            url = `https://elegant-project.onrender.com/api/product/category/${activeCategory}`;
            break;
        }

        // 👇 Force re-load when refreshKey changes, even for "all"
        const res = await fetch(`${url}?refresh=${refreshKey}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Fetched products:", data);

        if (activeCategory === "newest") {
          const sorted = [...data.data].sort(
            (a: any, b: any) =>
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          setProducts(sorted);
          setVisibleProducts(sorted.slice(0, pageSize));
        } else {
          setProducts(data.data);
          setVisibleProducts(data.data.slice(0, pageSize));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }finally{
        setLoading(false)
      }
    };

    getProduct();
  }, [activeCategory, refreshKey]);



  // Fetch categories
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
        setCategories([
          { id: "all", name: "All Items" },
          { id: "newest", name: "Newest" },
          ...data.data,
        ]);
      }
    } catch (error) {
      console.error("Categories fetch error:", error);
    }
  };

  useEffect(() => {

    fetchCategories();
  }, [activeCategory]);


  console.log(activeCategory, 'activeCategoryactiveCategory')
  if (loading) {
    return (
      <AnimatedLoader visible={loading} />
    );
  }
  const handleToggleFavorite = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, wishlist_is: newStatus } : p
      )
    );

    try {
      const res = await fetch(`https://elegant-project.onrender.com/api/add-wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: id }),
      });

      const data = await res.json();
      if (!data.success) {
        // revert if API fails
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, wishlist_is: currentStatus } : p
          )
        );
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      // revert on error
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, wishlist_is: currentStatus } : p
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
     <View style={styles.headerRow}>
  {/* Left side: Title + Timer */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={styles.title}>Flash sale</Text>
    <View style={styles.timer}>
      <Text style={styles.timerText}>{String(timeLeft.h).padStart(2, "0")}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.timerText}>{String(timeLeft.m).padStart(2, "0")}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.timerText}>{String(timeLeft.s).padStart(2, "0")}</Text>
    </View>
  </View>

  {/* Right side: See All */}
  <TouchableOpacity onPress={()=>navigation.navigate('ProductScreen')}>
    <Text style={styles.seeAll}>See All</Text>
  </TouchableOpacity>
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
      {loading ? <Loader /> :
        <View style={styles.productsGrid}>
          {visibleProducts && visibleProducts.length ?

            visibleProducts.map((item) => (
                    
              <View key={item.id} style={styles.productCard} item={item}>
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => { navigation.navigate("ProductDetailScreen"), setProductId(item.id); } }>

                    <Image
                      source={item.images ? { uri: item.images[0] } : redDress}
                      style={styles.productImage} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.wishlistBtn,
                      { backgroundColor: item.wishlist_is ? "#ffffff" : "#000000ff" }
                    ]}
                    onPress={() => handleToggleFavorite(item.id, item.wishlist_is)}
                  >
                    <Icon
                      name={item.wishlist_is ? "heart" : "heart-outline"}
                      size={22}
                      color={item.wishlist_is ? "#000000" : "#ffffff"} />
                  </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={() => { navigation.navigate("ProductDetailScreen"), setProductId(item.id); } }>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>

                <View style={styles.priceRatingRow}>
                  <TouchableOpacity onPress={() => { navigation.navigate("ProductDetailScreen"), setProductId(item.id); } }>
                    <Text style={styles.productPrice}>₹{item.price}</Text>
                  </TouchableOpacity>
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={14} color="gold" />
                    <Text style={styles.ratingText}>{item.rating ?? "5"}</Text>
                  </View>


                </View>
              </View>
            )) : <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>No Products</Text>
            </View>}


        </View>}
      {products && products.length &&
      <View style={{margin:25}}>
      {/* <Button text={"View All"} onPress={() => { setCategoriesId(activeCategory), navigation.navigate('ProductScreen') }}
       bgColor={"#704F38"} textColor={"#ffffffff"} /> */}
       </View>
      }
    </View>
  );
};

export default FlashSale;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

headerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

title: {
  fontSize: 18,
  fontWeight: "600",
  color: "#010911",
  marginRight: 10, // spacing before timer
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
  marginHorizontal: 4,
  fontWeight: "bold",
  fontSize: 14,
},

seeAll: {
  fontSize: 14,
  fontWeight: "400",
  color: "#704F38", // brownish like in your screenshot
},
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderRadius: 20,
    marginRight: 8,
    borderColor: "#AFAFAF",
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between", // pushes price left, rating right
    alignItems: "center",
    marginTop: 4,
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
    width: "48%",
    marginBottom: 15,
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
    backgroundColor: "#000000ff",
    borderRadius: 25,
    padding: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
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
    fontWeight: 400,
    color: "#292526",
  },
  noProductsContainer: {
    minHeight: 400,
    flexGrow: 1,             // ensures ScrollView content takes full height
    justifyContent: 'center', // vertical center
    alignItems: 'center',     // horizontal center
    backgroundColor: '#fff',  // optional
  },
  noProductsText: {
    marginBottom:25,
    fontSize: 18,
    fontWeight: '500',
    color: '#704F38',
    textAlign: 'center',
  },
});
