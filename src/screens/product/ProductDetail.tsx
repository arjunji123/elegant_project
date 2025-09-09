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



const imageUpdate = [
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/plq88fklqrfax81qodjl.png",
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/rjrgj6gvgut7oeviuxi1.png",
    "https://res.cloudinary.com/dfhzted2d/image/upload/v1756059366/products/xk5ggguxapefdivmhqqc.jpg",
];

const ProductDetail = ({ route, navigation }) => {
    const [selectedSize, setSelectedSize] = useState("M");
    const [product, setProduct] = useState<any>(null);
    const [recommeded, setrecommeded] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [categoriesId, setCategoriesId] = useState()
    const [showFull, setShowFull] = useState();
    const wordLimit = 20;
    const description = product?.description || "";
    const words = description.split(" ");
    const truncated = words.slice(0, wordLimit).join(" ");
    const isLong = words.length > wordLimit;
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const { productId, token, setProductId } = useAuth();
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
                    setCategoriesId(data.data.category_id)
                    setLoading(false);
                    if (data.data.colors && data.data.colors.length > 0) {
                        setSelectedColor(data.data.colors[0].color_code);
                    }

                }
            } catch (error) {
                console.error("Server Error:", error);
            }
        };


        getProductDetail();

    }, [productId]);

    const getRecommedProduct = async (categoriesId) => {
        try {
            const res = await fetch(
                `https://elegant-project.onrender.com/api/product/category/${categoriesId}`,
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

    useEffect(() => {
        getRecommedProduct(categoriesId);
    }, [categoriesId])
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
    console.log(productId, "product?.colors?")
    // 🔥 New toggle function for recommended product
    const toggleRecommendedFavorite = async (itemId: string, currentStatus: number) => {
        const newStatus = currentStatus === 1 ? 0 : 1;

        try {
            const res = await fetch(
                `https://elegant-project.onrender.com/api/add-wishlist`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        product_id: itemId,
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
                // update only the clicked product
                setrecommeded((prev: any) =>
                    prev.map((p: any) =>
                        p.id === itemId ? { ...p, wishlist_is: newStatus } : p
                    )
                );
            }
        } catch (error) {
            console.error("Wishlist toggle failed:", error);
        }
    };

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
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

            <View style={styles.container}>

                <ScrollView showsVerticalScrollIndicator={false}  >
                    <View style={styles.backheader}>
                        <TouchableOpacity style={styles.iconWrapper} onPress={handleGoBack}>
                            <Icon name="chevron-back" size={22} color="#000" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.wishlistBtn,
                                {
                                    backgroundColor: product?.wishlist_is && product.wishlist_is
                                        ? "#ffffff"
                                        : "#000000ff",
                                },
                            ]}
                            onPress={() => toggleFavorite(product.id, product.wishlist_is)}
                        >
                            <Icon
                                name={product?.wishlist_is && product.wishlist_is
                                    ? "heart"
                                    : "heart-outline"}
                                size={22}
                                color={product?.wishlist_is && product.wishlist_is
                                    ? "#000000"
                                    : "#ffffff"} />
                        </TouchableOpacity>
                    </View>


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
                            <>
                                <Image source={{ uri: item }} style={styles.mainImage} /></>
                        )}
                    />

                    {/* 🔥 Thumbnails */}
                    <View style={styles.imagealign}>
                        <FlatList
                            ref={thumbRef}
                            data={images}
                            snapToInterval={width}
                            decelerationRate="fast"
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
                                            selectedColor === color.color_code && styles.colorWrapperActive,
                                        ]}
                                        onPress={() => setSelectedColor(color.color_code)}
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
                            <><Text style={styles.sectionTitle}>Recommendation</Text>
                                <FlatList
                                    data={recommeded}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.recommendCard}>
                                            <TouchableOpacity
                                                onPress={() => setProductId(item.id)}                                            >
                                                <Image
                                                    source={{
                                                        uri: item.images
                                                            ? item.images[0]
                                                            : "https://via.placeholder.com/150",
                                                    }}
                                                    style={styles.recommendImage} />
                                            </TouchableOpacity>
                                            {/* Wishlist Button */}
                                            <TouchableOpacity
                                                style={[
                                                    styles.wishlistBtnRecommeder,
                                                    {
                                                        backgroundColor: item.wishlist_is && item.wishlist_is === 1
                                                            ? "#ffffff"
                                                            : "#000000ff",
                                                    },
                                                ]}
                                                onPress={() => toggleRecommendedFavorite(item.id, item.wishlist_is)}
                                            >
                                                <Icon
                                                    name={item.wishlist_is && item.wishlist_is === 1 ? "heart" : "heart-outline"}
                                                    size={22}
                                                    color={item.wishlist_is && item.wishlist_is === 1 ? "#000000" : "#ffffff"}
                                                />
                                            </TouchableOpacity>
                                            🔥 What Changed

                                            <Text style={styles.recommendName}>{item.name}</Text>
                                            <Text style={styles.recommendPrice}>
                                                {item.unit}
                                                {item.price}
                                            </Text>
                                        </View>
                                    )} /></>
                        ) : (
                            <><Text style={styles.sectionTitle}>Recommendation</Text><Text style={styles.productHeader}>
                                No recommended products found
                            </Text></>
                        )}


                    </View>

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
    container: { flex: 1, backgroundColor: "#fff", },
    mainImage: { width: width, height: 425, resizeMode: "cover" },
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
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15, // keep spacing inside
        zIndex: 10,
    },
    iconWrapper: {
        width: 45,
        height: 45,
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
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },

    // wishlistBtn: {
    //     right: 10,
    //     marginRight: 15,
    //     borderRadius: 25,
    //     width: 45,
    //     height: 45,
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    productHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        // marginTop: 5,
        paddingLeft: 10,
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
    sizeBoxActive: { backgroundColor: "#704F38", borderColor: "#222" },
    sizeText: { color: "#222" },
    sizeTextActive: { color: "#fff" },
    colorRow: {
        flexDirection: "row",
        flexWrap: "wrap",       // allow wrapping to new line
        alignItems: "center",   // vertical center alignment
        gap: 6,
        marginHorizontal: 5,
        marginTop: 10,
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
        borderColor: "#b37a5bff", // dark brown outer border
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