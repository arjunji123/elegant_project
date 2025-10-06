// FlashSale.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import AnimatedLoader from "../../components/AnimatedLoader";

const redDress =
  "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059417/products/kqnhfrcvlcs9b3nxy5fg.png";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  wishlist_is?: number;
  images?: string[];
}

const pageSize = 4;

const FlashSale = ({ navigation, refreshKey }) => {
  const { setProductId, token } = useAuth();

  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 3, m: 38, s: 10 });

  // --- Fetch Categories Once ---
  const fetchCategories = async () => {
    try {
      const res = await fetch(`https://elegant-project.onrender.com/api/categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
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
  }, []);

  // --- Fetch Products on Category Change / Refresh ---
  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      setLoading(true); // overlay loader, old products stay visible

      try {
        let url = "";
        switch (activeCategory) {
          case "all":
          case "newest":
            url = "https://elegant-project.onrender.com/api/getallProducts";
            break;
          default:
            url = `https://elegant-project.onrender.com/api/product/category/${activeCategory}`;
            break;
        }

        const res = await fetch(`${url}?refresh=${refreshKey}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!ignore) {
          let list = data.data || [];

          if (activeCategory === "newest") {
            list = [...list].sort(
              (a: any, b: any) =>
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
          }

          setProducts(list);
          setVisibleProducts(list.slice(0, pageSize));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [activeCategory, refreshKey]);

  // --- Toggle Wishlist ---
  const toggleFavorite = (productId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, wishlist_is: newStatus } : p))
    );
    setVisibleProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, wishlist_is: newStatus } : p))
    );

    fetch(`https://elegant-project.onrender.com/api/add-wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          // revert if API fails
          setProducts((prev) =>
            prev.map((p) => (p.id === productId ? { ...p, wishlist_is: currentStatus } : p))
          );
          setVisibleProducts((prev) =>
            prev.map((p) => (p.id === productId ? { ...p, wishlist_is: currentStatus } : p))
          );
        }
      })
      .catch(() => {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, wishlist_is: currentStatus } : p))
        );
        setVisibleProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, wishlist_is: currentStatus } : p))
        );
      });
  };

  if (!products.length && loading) {
    return <AnimatedLoader visible={loading} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
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
        <TouchableOpacity onPress={() => navigation.navigate("ProductScreen")}>
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
            <Text
              style={[styles.categoryText, activeCategory === cat.id && styles.activeCategoryText]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <View style={styles.productsGrid}>
        {visibleProducts && visibleProducts.length ? (
          <>
            {visibleProducts.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ProductDetailScreen");
                      setProductId(item.id);
                    }}
                  >
                    <Image
                      source={item.images ? { uri: item.images[0] } : { uri: redDress }}
                      style={styles.productImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.wishlistBtn,
                      { backgroundColor: item.wishlist_is ? "#ffffff" : "#000000ff" },
                    ]}
                    onPress={() => toggleFavorite(item.id, item.wishlist_is ?? 0)}
                  >
                    <Icon
                      name={item.wishlist_is ? "heart" : "heart-outline"}
                      size={22}
                      color={item.wishlist_is ? "#000000" : "#ffffff"}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ProductDetailScreen");
                    setProductId(item.id);
                  }}
                >
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>

                <View style={styles.priceRatingRow}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ProductDetailScreen");
                      setProductId(item.id);
                    }}
                  >
                    <Text style={styles.productPrice}>₹{item.price}</Text>
                  </TouchableOpacity>
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={14} color="gold" />
                    <Text style={styles.ratingText}>{item.rating ?? "5"}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Overlay Loader */}
            {loading && (
              <View style={styles.overlayLoader}>
                <AnimatedLoader visible={loading} />
              </View>
            )}
          </>
        ) : (
          !loading && (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>No Products</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default FlashSale;

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "600", color: "#010911", marginRight: 10 },
  timer: { flexDirection: "row", alignItems: "center" },
  timerText: { backgroundColor: "#ED3939", color: "#fff", paddingHorizontal: 6, paddingVertical: 4, borderRadius: 20, fontWeight: "bold", fontSize: 12 },
  colon: { marginHorizontal: 4, fontWeight: "bold", fontSize: 14 },
  seeAll: { fontSize: 14, fontWeight: "400", color: "#704F38" },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderRadius: 20, marginRight: 8, borderColor: "#AFAFAF" },
  activeCategory: { backgroundColor: "#704F38", borderWidth: 0 },
  categoryText: { fontSize: 13, color: "#000", fontWeight: "500" },
  activeCategoryText: { color: "#fff" },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", position: "relative" },
  productCard: { backgroundColor: "#fff", width: "48%", marginBottom: 15 },
  imageContainer: { position: "relative", borderRadius: 8, overflow: "hidden" },
  productImage: { width: 180, height: 200, borderRadius: 8 },
  wishlistBtn: { position: "absolute", top: 8, right: 8, borderRadius: 25, padding: 4 },
  productName: { fontSize: 13, fontWeight: "500", marginTop: 5 },
  productPrice: { fontSize: 14, fontWeight: "600", color: "#000", marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  ratingText: { fontSize: 12, marginLeft: 2, fontWeight: "400", color: "#292526" },
  noProductsContainer: { minHeight: 400, flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  noProductsText: { marginBottom: 25, fontSize: 18, fontWeight: "500", color: "#704F38", textAlign: "center" },
  overlayLoader: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -20 }, { translateY: -20 }] },
});
