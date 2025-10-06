import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native";
import visa from '../../assets/images/visa.png'
import Header from "../../components/Header"
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useToast } from "../../Context/ToastContext";

const Coupon = () => {
    const navigation = useNavigation();
    const { token } = useAuth();
    const [coupon, setCoupon] = useState([]);
    const [couponId, setCouponId] = useState<number | null>(null);
    const [searchText, setSearchText] = useState(""); // 🔑 new state
    const tokens = { token };
  const { showToast } = useToast();

    // Fetch all coupons initially
    useEffect(() => {
        FetchCoupon();
    }, []);

    const FetchCoupon = async () => {
        try {
            const res = await fetch(`https://elegant-project.onrender.com/api/user/coupons`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokens.token}`,
                },
            });
            const data = await res.json();
            if (data.success && data.coupons) {
                setCoupon(data.coupons);
            } else {
                console.error("Error fetching coupons:", data.message);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };

    // Apply coupon
    const updateCoupon = async (id: number) => {
        try {
            const res = await fetch(`https://elegant-project.onrender.com/api/apply-coupon`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokens.token}`,
                },
                body: JSON.stringify({ couponId: id }),
            });

            const data = await res.json();

            if (data.success) {
                setCoupon(prev =>
                    prev.map(c =>
                        c.id === id
                            ? { ...c, user_status: "applied" }
                            : { ...c, user_status: "not_applied" }
                    )
                );
                navigation.navigate("CartScreen")
            }
            else{
                showToast(data.message,"error")
            }
        } catch (error) {
            console.error("Error updating Coupon:", error);
        }
    };




    // 🔍 Search coupons
    const handleSearch = async (text: string) => {
        setSearchText(text);

        if (text.trim() === "") {
            FetchCoupon(); // reset to all coupons
            return;
        }

        try {
            const res = await fetch(
                `https://elegant-project.onrender.com/api/coupons/search?keyword=${encodeURIComponent(text)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                }
            );
            const data = await res.json();
            if (data.success && data.coupons) {
                setCoupon(data.coupons);
            } else {
                setCoupon([]);
            }
        } catch (error) {
            console.error("Error searching coupons:", error);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <Header text={"Coupon Code"} onPress={handleGoBack} />

            {/* 🔍 Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Icon name="search" size={18} color="#838383" />
                    <TextInput
                        placeholder="Search here"
                        value={searchText}
                        onChangeText={handleSearch}
                        style={{ flex: 1 }}
                    />
                </View>
            </View>

            {/* Coupon List */}
            {coupon.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
                    No coupons found
                </Text>
            ) : (
                coupon.map((item) => (
                    <View key={item.id} style={styles.addresscontainer}>
                        <Image source={visa} style={styles.addressIcon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.addressText}>{item.title}</Text>
                            <Text style={styles.titleText}>{item.description}</Text>
                        </View>

                        {item.user_status === "applied" ? (
                            <Icon name="checkmark-circle" size={22} color="green" />
                        ) : (
                            <TouchableOpacity onPress={() => updateCoupon(item.id)}>
                                <Text style={styles.applyButton}>Apply</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            )}
        </ScrollView>
    );
};

export default Coupon;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        paddingHorizontal: 16,
        paddingTop: 30,
    },
    addresscontainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 10,
        marginVertical: 8,
        backgroundColor: "#fff",
    },
    addressIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    addressText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    titleText: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    applyButton: {
        fontSize: 12,
        color: "#704F38",
        fontWeight: "600",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
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
});
