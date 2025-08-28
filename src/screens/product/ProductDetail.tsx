// ProductDetail.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";


const redDress = "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059417/products/kqnhfrcvlcs9b3nxy5fg.png"

const imageUpdate = [
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/plq88fklqrfax81qodjl.png",
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/rjrgj6gvgut7oeviuxi1.png",
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/xk5ggguxapefdivmhqqc.jpg"
]

const ProductDetail = ({ navigation }) => {
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState("#c68958");
    const [product, setProduct] = useState<any>(null)
    const [isFavorite, setIsFavorite] = useState(false);
    const [recommeded, setrecommeded] = useState<any>(null)
    const [loading, setLoading] = useState(true);

    const imageObjects = product?.images ? product.images.map((index) => ({
        uri: index
    })) : redDress

    const [selectedImage, setSelectedImage] = useState<any>(imageObjects ? imageObjects[0]?.uri : redDress);

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
                setProduct((prev: any) => ({
                    ...prev,
                    wishlist_is: newStatus
                }));
            }
        } catch (error) {
            console.error("Wishlist toggle failed:", error);
        }
    };


    const { productId, token } = useAuth()
    useEffect(() => {
        const getProductDetail = async () => {
            try {
                const res = await fetch(
                    `https://elegant-project.onrender.com/api/product/${productId}`,
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
                    setProduct(data.data);
                }

            } catch (error) {
                console.error("Server Error:", error);
            }
        };
        const getRecommedProduct = async () => {
            try {
                if (!product) return;
                const res = await fetch(
                    `https://elegant-project.onrender.com/api/product/category/${product.category_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`, // ✅ token added here too
                        },
                    }
                );
                const text = await res.text();
                const data = JSON.parse(text);
                console.log(data, "datadatadata")
                if (data.success && data.data) {
                    setrecommeded(data.data);
                }
            } catch (error) {
                console.error("Categories fetch error:", error);
            }
        }

        getProductDetail();
        getRecommedProduct();
    }, [productId]);
    const handleGoBack = () => navigation.goBack();
    return (
        <View style={styles.container}>
            <View style={styles.backheader}>
                {/* Back button */}
                <TouchableOpacity style={styles.iconWrapper} onPress={handleGoBack}>
                    <Icon name="chevron-back" size={22} color="#000" />
                </TouchableOpacity>

                {/* Wishlist button */}
                <TouchableOpacity
                    style={[
                        styles.wishlistBtn,
                        { backgroundColor: product?.wishlist_is && product.wishlist_is ? "#ffffff" : "#000000ff" }
                    ]}
                    onPress={() => toggleFavorite(product.id, product.wishlist_is)}>
                    <Icon
                        name={product?.wishlist_is && product.wishlist_is ? "heart" : "heart-outline"}
                        size={22}
                        color={product?.wishlist_is && product.wishlist_is ? "#000000" : "#ffffff"} />
                </TouchableOpacity>
            </View>


            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <Image
                    source={selectedImage ? { uri: selectedImage } : { uri: product?.images[0] }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />
                <View style={styles.imagealign}>
                    <FlatList
                        data={product?.images ? product.images : imageUpdate}
                        keyExtractor={(item, index) => index.toString()} // since images are strings
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailList}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setSelectedImage(item)}>
                                <Image
                                    source={{ uri: item }}
                                    style={[styles.thumbnail]} />
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View style={styles.tittleContainer}>
                    {/* Row for category and rating */}
                    <View style={styles.categoryRatingRow}>
                        <Text style={styles.categoriesName}>{product?.category_name}</Text>
                        <View style={styles.ratingRow}>
                            <Icon name="star" size={16} color="gold" />
                            <Text style={styles.ratingText}>4.0</Text>
                        </View>
                    </View>

                    {/* Product name below */}
                    <Text style={styles.productTitle}>{product?.name}</Text>
                </View>

                {/* Description */}
                <Text style={styles.sectionDescription}>Description</Text>
                <Text style={styles.description}>
                    {product && product.description}
                </Text>

                {/* Sizes */}
                <Text style={styles.sectionTitle}>Select Size</Text>
                <View style={styles.sizeRow}>
                    {product && product.sizes.map((size) => (
                        <TouchableOpacity
                            key={size}
                            style={[
                                styles.sizeBox,
                                selectedSize === size && styles.sizeBoxActive,
                            ]}
                            onPress={() => setSelectedSize(size)}
                        >
                            <Text
                                style={[
                                    styles.sizeText,
                                    selectedSize === size && styles.sizeTextActive,
                                ]}
                            >
                                {size}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Colors */}
                <Text style={styles.sectionTitle}>Choose Color</Text>
                <View style={styles.colorRow}>
                    {product && product.colors.map((color) => (
                        <TouchableOpacity
                            key={color.color_name}
                            style={[
                                styles.colorCircle,
                                { backgroundColor: color.color_code },
                                selectedColor === color && styles.colorCircleActive,
                            ]}
                            onPress={() => setSelectedColor(color)}
                        />
                    ))}
                </View>


                {/* Recommendations */}
                <Text style={styles.sectionTitle}>Recommendation</Text>

                {recommeded && recommeded.length > 0 ? (
                    <FlatList
                        data={recommeded}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.recommendCard}>
                                <Image
                                    source={{
                                        uri: item.images
                                            ? item.images[0]
                                            : "https://via.placeholder.com/150", // 👈 fallback
                                    }}
                                    style={styles.recommendImage}
                                />
                                <Text style={styles.recommendName}>{item.name}</Text>
                                <Text style={styles.recommendPrice}>
                                    {item.unit}{item.price}
                                </Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.productHeader}>No recommended products found</Text>
                )}

            </ScrollView>

            <View style={styles.bottomBar}>
                <Text style={styles.totalPrice}>
                    Total Price{"\n"}
                    <Text style={styles.price}>
                        {product?.unit}{product?.price}
                    </Text>
                </Text>
                <TouchableOpacity style={styles.addToCartBtn}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductDetail;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        alignItems: "center",
    },
    mainImage: { width: "100%", height: 400 },
    categoriesName: {
        color: "#838383",
        paddingLeft: 16,
        marginTop: 15

    },
    tittleContainer: {
        marginRight: 10
    },
    imagealign: {
        alignItems: 'center'

    },
    wishlistBtn: {
        right: 10,
        marginRight: 10,
        backgroundColor: "#000000ff",
        borderRadius: 25,
        width: 42,
        height: 42,
        justifyContent: "center",   // center vertically
        alignItems: "center",       // center horizontally
    },
    backheader: {
        position: "absolute",
        top: 40, // adjust depending on status bar
        left: 20,
        right: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
    },
    iconWrapper: {
        width: 42,
        height: 42,
        marginLeft: 15,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    thumbnailList: {
        marginTop: 25,
        paddingHorizontal: 5,
        alignItems: "center",
    },
    thumbnail: {
        width: 55,
        height: 55,
        borderRadius: 10,
        marginRight: 10,
    },
    activeThumbnail: {
        borderWidth: 2,
    },
    productHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
        paddingLeft: 16,
        alignItems: "center",
    },
    categoryRatingRow: {
        flexDirection: "row",
        justifyContent: "space-between", // category on left, rating on right
        alignItems: "center",
        marginBottom: 4, // space between row and product name
    },
    productTitle: { fontSize: 20, fontWeight: "600", color: "#222", paddingLeft: 16 },
    ratingRow: { flexDirection: "row", alignItems: "center" },
    ratingText: { marginLeft: 4, color: "#555" },
    sectionDescription: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 16,
        marginHorizontal: 16,
        color: "#222",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 16,
        marginHorizontal: 16,
        color: "#222",
    },
    description: { marginHorizontal: 16, marginTop: 6, color: "#838383" },
    sizeRow: { flexDirection: "row", marginHorizontal: 16, marginTop: 10 },
    sizeBox: {
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: 10,
    },
    sizeBoxActive: { backgroundColor: "#222", borderColor: "#222" },
    sizeText: { color: "#222" },
    sizeTextActive: { color: "#fff" },
    colorRow: { flexDirection: "row", margin: 16, gap: 12 },
    colorCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    colorCircleActive: { borderWidth: 2, borderColor: "#000" },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: 16,
        alignItems: "center",
    },
    addReviewBtn: {
        backgroundColor: "#654321",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    addReviewText: { color: "#fff", fontSize: 12 },
    reviewCard: { marginHorizontal: 16, marginTop: 12 },
    reviewRow: { flexDirection: "row", justifyContent: "space-between" },
    reviewName: { fontWeight: "600", color: "#222" },
    reviewDate: { fontSize: 12, color: "#888" },
    reviewComment: { marginTop: 6, color: "#555" },
    reviewImagesRow: { flexDirection: "row", marginTop: 8, gap: 8 },
    reviewImage: { width: 60, height: 60, borderRadius: 8 },
    recommendCard: { margin: 10, width: 120 },
    recommendImage: { width: "100%", height: 120, borderRadius: 8 },
    recommendName: { fontSize: 14, fontWeight: "500", marginTop: 6 },
    recommendPrice: { color: "#c68958", marginTop: 2 },
    bottomBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#eee",
        alignItems: "center",
    },
    totalPrice: {
        color: "#838383", // gray for "Total Price"
        fontSize: 14,
    },

    price: {
        color: "#000000", // black for the price
        fontSize: 16,
        fontWeight: "600",
    }, 
    
addToCartBtn: {
    backgroundColor: "#654321",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
},
addToCartText: { 
    color: "#fff", 
    fontWeight: "600", 
    textAlign: "center", // center text horizontally
    fontSize: 16,        // optional, makes text a bit bigger
},});
