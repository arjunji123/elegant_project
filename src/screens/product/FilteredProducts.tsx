import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useFilter } from "../../Context/FilterContext";
import { useAuth } from "../../Context/AuthContext";
import Header from "../../components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const redDress =
  "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059417/products/kqnhfrcvlcs9b3nxy5fg.png";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

const FilteredProducts = ({ navigation }) => {
  const { filter } = useFilter();
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    filter.category_id || []
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [limit] = useState(6);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { token, setProductId } = useAuth();
  const insets = useSafeAreaInsets();
  const [wishlistItems, setWishlistItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  // ✅ Fetch products with pagination
  const getFilteredProducts = async () => {
    try {
      setLoading(true);
      const url = new URL(
        `https://elegant-project.onrender.com/api/filters?limit=${limit}&offset=${offset}`
      );

      if (selectedCategories.length) {
        url.searchParams.append("category_id", selectedCategories.join(","));
      }
      if (filter.subcategory_id) {
        url.searchParams.append("subcategory_id", filter.subcategory_id);
      }
      if (filter.min_price) {
        url.searchParams.append("min_price", filter.min_price.toString());
      }
      if (filter.max_price) {
        url.searchParams.append("max_price", filter.max_price.toString());
      }
      if (filter.sort) {
        url.searchParams.append("sort", filter.sort);
      }

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success && data.data) {
        setProducts((prev) => {
          if (offset === 0) return data.data; // fresh load
          const unique = data.data.filter(
            (item) => !prev.some((p) => p.id === item.id)
          );
          return [...prev, ...unique];
        });

        if (data.data.length < limit) {
          setHasMore(false);
        }
      } else {
        if (offset === 0) setProducts([]);
        setHasMore(false);
      }
    } 
    
    catch (error) {
      console.error("Products fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset pagination when filter/category changes
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setProducts([]);
    getFilteredProducts();
  }, [selectedCategories, filter]);

  // ✅ Load more when offset increases
  useEffect(() => {
    if (offset > 0 && hasMore) {
      getFilteredProducts();
    }
  }, [offset]);

  // Fetch categories once
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://elegant-project.onrender.com/api/categories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();
      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Categories fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Wishlist toggle
  const toggleFavorite = async (productId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const res = await fetch(
        `https://elegant-project.onrender.com/api/add-wishlist`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Wishlist API response not JSON:", text);
        return;
      }

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

  const handleToggleFavorite = async (id: number, current: boolean) => {
    setWishlistItems((prev) => ({ ...prev, [id]: !current }));
    try {
      await toggleFavorite(id, current ? 1 : 0);
    } catch {
      setWishlistItems((prev) => ({ ...prev, [id]: current }));
    }
  };

  const handleGoBack = () => {
    navigation.navigate("HomeScreen");
  };
    console.log(categories, 'getProductgetProduct')

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isEndReached =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;

          if (isEndReached && !loading && hasMore) {
            setOffset((prev) => prev + limit);
          }
        }}
      >
        <Header text={"Product Listing"} onPress={handleGoBack} />

        {/* 🔎 Search + Filter */}
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
                color="#aaa"
                style={{ marginHorizontal: 8 }}
              />
              <TextInput onPressIn={() => navigation.navigate("SearchProductScreen")} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate("AdvanceFilterScreen")}
          >
            <Icon name="options-outline" size={20} color="#000000ff" />
          </TouchableOpacity>
        </View>

        {/* 🏷 Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.activeCategory]}
                onPress={() =>
                  setSelectedCategories((prev) =>
                    prev.includes(cat.id)
                      ? prev.filter((c) => c !== cat.id)
                      : [...prev, cat.id]
                  )
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.activeCategoryText,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 🛒 Product Grid */}
        <View style={[styles.productsGrid, { paddingBottom: insets.bottom }]}>
          {products.length ? (
            products.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ProductDetailScreen");
                    setProductId(item.id);
                  }}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={item.images ? { uri: item.images[0] } : { uri: redDress }}
                      style={styles.productImage}
                    />
                    <TouchableOpacity
                      style={[
                        styles.wishlistBtn,
                        {
                          backgroundColor:
                            wishlistItems[item.id] ?? item.wishlist_is
                              ? "#ffffff"
                              : "#000000ff",
                        },
                      ]}
                      onPress={() =>
                        handleToggleFavorite(
                          item.id,
                          wishlistItems[item.id] ?? item.wishlist_is
                        )
                      }
                    >
                      <Icon
                        name={
                          wishlistItems[item.id] ?? item.wishlist_is
                            ? "heart"
                            : "heart-outline"
                        }
                        size={22}
                        color={
                          wishlistItems[item.id] ?? item.wishlist_is
                            ? "#000000"
                            : "#ffffff"
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.priceRatingRow}>
                    <Text style={styles.productPrice}>₹{item.price}</Text>
                    <View style={styles.ratingRow}>
                      <Icon name="star" size={14} color="gold" />
                      <Text style={styles.ratingText}>
                        {item.rating ?? "5"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            !loading && (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>No Products</Text>
              </View>
            )
          )}
        </View>

        {/* 🔄 Loader at bottom */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#8B5E3C"
            style={{ marginVertical: 20 }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default FilteredProducts;


const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: "#fff",
        paddingTop: 20
    },
    scrollContent: {
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 30, // extra space at bottom
    },
    header: {
        position: "relative",
        height: 40,
        justifyContent: "center",
        marginBottom: 24,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: { padding: 8 },
    backIcon: { width: 24, height: 24, resizeMode: 'contain' },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 24,
        color: "#000000",
        fontWeight: "normal",
        fontFamily: "Poppins",
    },
    subtitle: {
        textAlign: "left",
        fontSize: 18,
        padding: 10,
        color: "#000000",
        fontWeight: "normal",
        fontFamily: "Poppins",
        marginRight: 40,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingVertical: 6,
        marginTop: 8,
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
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#000",
    },
    filterButton: {
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 8,
        shadowColor: "#000000ff",
        shadowOffset: { width: 0, height: 2 },
        marginHorizontal: 8,
        elevation: 2,
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
    },
    activeCategoryText: {
        color: "#fff",
    },
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        borderRadius: 30,
        padding: 5
    },
    priceRatingRow: {
        flexDirection: "row",
        justifyContent: "space-between", // pushes price left, rating right
        alignItems: "center",
        marginTop: 4,
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
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 4,
    },
    productName: {
        fontSize: 13,
        fontWeight: "500",
        marginTop: 10,
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
    noProductsContainer: {
        minHeight: 400,
        flexGrow: 1,             // ensures ScrollView content takes full height
        justifyContent: 'center', // vertical center
        alignItems: 'center',     // horizontal center
        backgroundColor: '#fff',  // optional
    },
    noProductsText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#704F38',
        textAlign: 'center',
    },
})