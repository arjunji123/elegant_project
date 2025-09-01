
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useFilter } from "../../Context/FilterContext";
import { useAuth } from "../../Context/AuthContext";
import Arrowleft from "../../assets/icons/Arrowleft.png";
import Header from "../../components/Header";

const redDress = "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059417/products/kqnhfrcvlcs9b3nxy5fg.png"

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
}


const FilteredProducts = ({ navigation }) => {
    const { filter } = useFilter()
    const [selectedCategories, setSelectedCategories] = useState<number[]>(filter.category_id);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token, setProductId } = useAuth()
    const [wishlistItems, setWishlistItems] = useState<{ [key: number]: boolean }>({});
    const getFilteredProducts = async () => {
        try {
            setLoading(true);

            // Always start with filters API
            const url = new URL("https://elegant-project.onrender.com/api/filters");

            // Append only if values exist
            if (filter.category_id) {
                url.searchParams.append("category_id", selectedCategories.join(","));
            }
            if (filter.category_id) {
                url.searchParams.append("subcategory_id", filter.category_id);
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
console.log("Filter API URL:", url.toString());
            const res = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success && data.data) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Products fetch error:", error);
        } finally {
            setLoading(false);
        }
    };
    const toggleCategory = (id: number) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };
    console.log(products, 'selectedCategories')

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://elegant-project.onrender.com/api/categories", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });

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

    // Load products every time activeCategory changes
    useEffect(() => {
        getFilteredProducts();
        console.log("updateupdatedd")
    }, [selectedCategories, filter]);

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

    const handleToggleFavorite = async (id: number, current: boolean) => {
        // Optimistic update
        setWishlistItems((prev) => ({ ...prev, [id]: !current }));

        try {
            await toggleFavorite(id, current); // API call
        } catch (error) {
            // Revert if API fails
            setWishlistItems((prev) => ({ ...prev, [id]: current }));
            console.error("Failed to update wishlist", error);
        }
    };
    const handleGoBack = () =>{
        navigation.navigate("HomeScreen")
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Header text={"Product Listing"} onPress={handleGoBack} />
                <View style={styles.searchContainer}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => navigation.navigate("SearchProductScreen")}
                        activeOpacity={0.8}>
                        <View style={styles.searchBar}>
                            <Icon
                                name="search"
                                size={18}
                                color="#aaa"
                                style={{ marginHorizontal: 8 }} />
                            <TextInput
                                // placeholder="Search here"
                                // placeholderTextColor="#aaa"
                                // style={styles.searchInput}
                                onPress={() => navigation.navigate("SearchProductScreen")}
                            />

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate("AdvanceFilterScreen")}>
                        <Icon name="options-outline" size={20} color="#000000ff" />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginVertical: 10 }}
                >
                    {categories.map((cat) => {
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.categoryChip, isSelected && styles.activeCategory]}
                                onPress={() => toggleCategory(cat.id)}
                            >
                                <Text style={[styles.categoryText, isSelected && styles.activeCategoryText]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={styles.productsGrid}>
                    {products.length
                        ?
                        products.map((item) => (
                            <View key={item.id} style={styles.productCard}>
                                <TouchableOpacity onPress={() => { navigation.navigate("ProductDetailScreen"), setProductId(item.id) }}>

                                    <View style={styles.imageContainer}>
                                        <TouchableOpacity onPress={() => { navigation.navigate("ProductDetailScreen"), setProductId(item.id) }}>

                                            <Image
                                                source={item.images ? { uri: item.images[0] } : redDress}
                                                style={styles.productImage} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.wishlistBtn,
                                                { backgroundColor: wishlistItems[item.id] ?? item.wishlist_is ? "#ffffff" : "#000000ff" }
                                            ]}
                                            onPress={() => handleToggleFavorite(item.id, wishlistItems[item.id] ?? item.wishlist_is)}
                                        >
                                            <Icon
                                                name={(wishlistItems[item.id] ?? item.wishlist_is) ? "heart" : "heart-outline"}
                                                size={22}
                                                color={(wishlistItems[item.id] ?? item.wishlist_is) ? "#000000" : "#ffffff"}
                                            />
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
                                </TouchableOpacity>
                            </View>
                        )) : <>

                            <View style={styles.noProductsContainer}>
                                <Text style={styles.noProductsText}>No Products</Text>
                            </View>                </>}
                </View>


            </ScrollView>
        </View>
    )
}

export default FilteredProducts

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