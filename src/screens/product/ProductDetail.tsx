// ProductDetail.tsx
import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import Skeleton, { SkeletonCard, SkeletonText } from "../../components/Skeleton";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const redDress =
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059417/products/kqnhfrcvlcs9b3nxy5fg.png";

const imageUpdate = [
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/plq88fklqrfax81qodjl.png",
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/rjrgj6gvgut7oeviuxi1.png",
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/xk5ggguxapefdivmhqqc.jpg",
];

const ProductDetail = ({ navigation }) => {
    const [selectedSize, setSelectedSize] = useState("M");
    const [product, setProduct] = useState<any>(null);
    const [recommeded, setrecommeded] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [fav, setIsFav] = useState(false);

    const [showFull, setShowFull] = useState(false);
    const wordLimit = 20;
    const description = product?.description || "";
    const words = description.split(" ");
    const truncated = words.slice(0, wordLimit).join(" ");
    const isLong = words.length > wordLimit;
    const [selectedColor, setSelectedColor] = useState(
        product?.colors?.[0].color_code || null
    );
    const { productId, token } = useAuth();

    // 🔥 slider states
    const [selectedIndex, setSelectedIndex] = useState(0);
    const sliderRef = useRef<FlatList<any>>(null);
    const thumbRef = useRef<FlatList<any>>(null);

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
                    body: JSON.stringify({
                        product_id: productId,
                    }),
                }
            );

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error("Wishlist parse error:", text);
                return;
            }

            if (data.success) {
                setProduct((prev: any) => ({
                    ...prev,
                    wishlist_is: newStatus,
                }));
            }
        } catch (error) {
            console.error("Wishlist toggle failed:", error);
        }
    };
    const toggleFavoriteRecommed = async (productId: string, currentStatus: number) => {
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
                    body: JSON.stringify({
                        product_id: productId,
                    }),
                }
            );

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error("Wishlist parse error:", text);
                return;
            }

            if (data.success) {
                setProduct((prev: any) => ({
                    ...prev,
                    wishlist_is: newStatus,
                }));
            }
        } catch (error) {
            console.error("Wishlist toggle failed:", error);
        }
    };
    useEffect(() => {
        const getProductDetail = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `https://elegant-project.onrender.com/api/product/${productId}`,
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
                    setProduct(data.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Server Error:", error);
            }
        };

        const getRecommedProduct = async () => {
            try {
                if (!product) return;
                setLoading(true);
                const res = await fetch(
                    `https://elegant-project.onrender.com/api/product/category/${product.category_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const text = await res.text();
                const data = JSON.parse(text);
                if (data.success && data.data) {
                    setrecommeded(data.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Categories fetch error:", error);
            }
        };

        getProductDetail();
        getRecommedProduct();
    }, [productId]);

    const handleGoBack = () => navigation.goBack();

    const onSelectImage = (index: number) => {
        setSelectedIndex(index);
        sliderRef.current?.scrollToIndex({ index, animated: true });
        thumbRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
        });
    };

    const images = product?.images && product.images.length > 0 ? product.images : imageUpdate;
    if (loading) {
        return (
            <>
                <SkeletonCard height={400} />
                <View style={styles.imagealign}>
                    <SkeletonCard height={50} width="50" style={{
                        width: 55,
                        height: 55,
                        borderRadius: 10,
                        margin: 10,
                    }} />
                </View>
                <SkeletonText height={30} style={{ margin: 10 }} />
                <SkeletonText height={30} style={{ margin: 10 }} />
                <SkeletonText height={30} style={{ margin: 10 }} />
                <SkeletonText height={30} style={{ margin: 10 }} />
                <SkeletonText height={30} style={{ margin: 10 }} />

            </>
        );
    }
    console.log(recommeded, "product?.colors?.[0]")
    return (
<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

<View style={styles.container}>
            <View style={styles.backheader}>
                <TouchableOpacity style={styles.iconWrapper} onPress={handleGoBack}>
                    <Icon name="chevron-back" size={22} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.wishlistBtn,
                        {
                            backgroundColor:
                                product?.wishlist_is && product.wishlist_is
                                    ? "#ffffff"
                                    : "#000000ff",
                        },
                    ]}
                    onPress={() => toggleFavorite(product.id, product.wishlist_is)}
                >
                    <Icon
                        name={
                            product?.wishlist_is && product.wishlist_is
                                ? "heart"
                                : "heart-outline"
                        }
                        size={22}
                        color={
                            product?.wishlist_is && product.wishlist_is
                                ? "#000000"
                                : "#ffffff"
                        }
                    />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}  >
                {/* 🔥 Image Slider */}


                <FlatList
                    ref={sliderRef}
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(
                            event.nativeEvent.contentOffset.x / width
                        );
                        setSelectedIndex(index);
                        thumbRef.current?.scrollToIndex({
                            index,
                            animated: true,
                            viewPosition: 0.5,
                        });
                    }}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.mainImage} />
                    )}
                />

                {/* 🔥 Thumbnails */}
                <View style={styles.imagealign}>
                    <FlatList
                        ref={thumbRef}
                        data={images}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailList}
                        renderItem={({ item, index }) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <TouchableOpacity onPress={() => onSelectImage(index)}>
                                    <Image
                                        source={{ uri: item }}
                                        style={[
                                            styles.thumbnail,
                                            isSelected && styles.activeThumbnail,
                                        ]}
                                    />
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                <View style={styles.mainContainer}>

                    <View >
                        <View style={styles.categoryRatingRow}>
                            <Text style={styles.categoriesName}>
                                {product?.category_name}
                            </Text>
                            <View style={styles.ratingRow}>
                                <Icon name="star" size={16} color="gold" />
                                <Text style={styles.ratingText}>4.0</Text>
                            </View>
                        </View>
                        <Text style={styles.productTitle}>{product?.name}</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        {showFull ? description : truncated + (isLong ? "..." : "")}
                        {isLong && (
                            <Text
                                style={styles.seeMoreText}
                                onPress={() => setShowFull(!showFull)}
                            >
                                {showFull ? " See Less" : " Read More"}
                            </Text>
                        )}
                    </Text>
                    <Text style={styles.sectionTitle}>Select Size</Text>
                    <View style={styles.sizeRow}>
                        {product &&
                            product.sizes.map((size) => (
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
                    <Text style={styles.sectionTitle}>Choose Color</Text>
                    <View style={styles.colorRow}>
                        {product &&
                            product.colors.map((color) => (
                                <TouchableOpacity
                                    key={color.color_name}
                                    style={[
                                        styles.colorWrapper,
                                        selectedColor === color && styles.colorWrapperActive,
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                >
                                    <View
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: color.color_code },
                                        ]}
                                    />
                                </TouchableOpacity>
                            ))}
                    </View>
                    {recommeded && recommeded.length > 0 ? (
                        <><Text style={styles.sectionTitle}>Recommendation</Text><FlatList
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
                                                : "https://via.placeholder.com/150",
                                        }}
                                        style={styles.recommendImage} />

                                    {/* Wishlist Button */}
                                    <TouchableOpacity
                                        style={[
                                            styles.wishlistBtnRecommeder,
                                            {
                                                backgroundColor: fav
                                                    ? "#ffffff"
                                                    : "#000000ff",
                                            },
                                        ]}
                                        onPress={() => setIsFav(fav == true ? false : true)}
                                    >
                                        <Icon
                                            name={fav ? "heart" : "heart-outline"}
                                            size={22}
                                            color={fav ? "#000000" : "#ffffff"} />
                                    </TouchableOpacity>

                                    <Text style={styles.recommendName}>{item.name}</Text>
                                    <Text style={styles.recommendPrice}>
                                        {item.unit}
                                        {item.price}
                                    </Text>
                                </View>
                            )} /></>
                    ) : (
                        <Text style={styles.productHeader}>
                            No recommended products found
                        </Text>
                    )}


                </View>
                {/* Rest of product detail UI */}





  <View style={styles.bottomBar} >
                <View>
                    <Text style={styles.totalPrice}>Total Price</Text>
                    <Text style={styles.price}>
                        {product?.unit}
                        {product?.price}
                    </Text>
                </View>

                <TouchableOpacity style={styles.addToCartBtn}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>

            </ScrollView>

          

        </View>
        </SafeAreaView>
        
    );
};

export default ProductDetail;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff",},
    mainImage: { width: 428, height: 425, resizeMode: "cover" },
    imagealign: { alignItems: "center" },
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
        borderWidth: 1,
        borderColor: "#ccc",
    },
    activeThumbnail: {
        borderWidth: 2,
        borderColor: "#000",
    },
    backheader: {
        position: "absolute",
        top: 40,
        left: 20,
        right: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 24,
        zIndex: 10,
    },
    iconWrapper: {
        width: 45,
        height: 45,
        marginLeft: 15,
        borderRadius: 25,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    wishlistBtn: {
        right: 10,
        marginRight: 10,
        borderRadius: 25,
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
    },
        productHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
        paddingLeft: 16,
        alignItems: "center",
    },
    wishlistBtnRecommeder: {
        position: "absolute",
        top: 8,
        right: 8,
        borderRadius: 20,
        padding: 6,
        elevation: 3, // shadow for Android
        shadowColor: "#000", // shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },

    // (keep your other styles unchanged…)
    mainContainer: {
        margin: 20
    },
    categoriesName: {
        color: "#838383",
        marginTop: 15

    },
    productTitle: { fontSize: 20, fontWeight: "600", color: "#222" },
    seeMoreText: {
        color: '#000000ff',
        fontWeight: '600',
        fontSize: 14,
    },
    categoryRatingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },

    ratingRow: { flexDirection: "row", alignItems: "center" },
    ratingText: { marginLeft: 4, color: "#555" },
    sectionDescription: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 16,

        color: "#222",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 16,

        color: "#222",
    },
    description: { marginTop: 6, color: "#838383" },
    sizeRow: { flexDirection: "row", marginTop: 10 },
    sizeBox: {
        width: 40,               // make width = height
        height: 40,
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 20,        // half of width/height for circle
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    sizeBoxActive: { backgroundColor: "#222", borderColor: "#222" },
    sizeText: { color: "#222" },
    sizeTextActive: { color: "#fff" },
    colorRow: {
        flexDirection: "row",
        margin: 16,
        gap: 12
    },

    // Outer wrapper for border
    colorWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    colorWrapperActive: {
        borderWidth: 2,
        borderColor: "#5a3c2c", // dark brown outer border
    },

    // Inner color circle
    colorCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },

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
        backgroundColor: "#F6F6F6"
    },

    totalPrice: {
        color: "#838383",
        fontSize: 14,
    },

    price: {
        color: "#000",
        fontSize: 18,
        fontWeight: "700",
    },

    addToCartBtn: {
        backgroundColor: "#6b4226",
        paddingVertical: 14,       // slightly taller
        paddingHorizontal: 40,     // wider pill
        borderRadius: 40,          // fully rounded pill
        alignItems: "center",
        justifyContent: "center",
        minWidth: 200,             // ensures wide button
    },

    addToCartText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },

});
