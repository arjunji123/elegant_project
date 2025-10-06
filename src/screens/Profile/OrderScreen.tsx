import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from "react-native";
import Header from "../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../Context/AuthContext";

const OrdersScreen = () => {
    const [tab, setTab] = useState("active");
    const [cartData, setCartData] = useState([])
      const [searchQuery, setSearchQuery] = useState("");

    const { token } = useAuth();
    const tokens = { token }

    const navigation = useNavigation();
    useEffect(() => {

        const fetchCart = async () => {
            try {
                const res = await fetch(`https://elegant-project.onrender.com/api/activeOrders`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                });
                const text = await res.text();


                const data = JSON.parse(text);
                if (data.success && data.orders) {
                    setCartData(data.orders)

                } else {
                    console.error("Error fetching user:", data.message);
                }

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }

        fetchCart();
    }, [])

      useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://elegant-project.onrender.com/api/searchOrders?keyword=${searchQuery}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success && data.orders) {
          setCartData(data.orders);
        } else {
          console.error("Error fetching orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (searchQuery) {
      fetchOrders();
    } else {
      setCartData([]); // Clear results when search query is empty
    }
  }, [searchQuery, token]);


console.log(cartData,"cartDatacartData")
    const renderContent = () => {
        switch (tab) {
            case "active": return <View>
              {cartData.map((item) => (
  item.products.map((productsItem) => (
    <View style={styles.orderCard} key={productsItem.product_id}>
      {/* Product Image */}
      <Image
        source={{ uri: productsItem?.image }}
        style={styles.image}
      />

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.title}>{productsItem.name}</Text>
        <Text style={styles.subText}>
          Size: {productsItem.size}   Color: {productsItem.color}
        </Text>

        {/* Price + Button */}
        <View style={styles.rowBetween}>
          <Text style={styles.price}>₹{productsItem.price}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ))
))}

            </View>;
            case "completed": return <Text style={styles.content}>Completed Orders</Text>;
            case "cancelled": return <Text style={styles.content}>Cancelled Orders</Text>;
            default: return null;
        }
    };
    const handleGoBack = () => {
        navigation.goBack();
    };
    return (
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
        >
            <Header text={'My Orders'} onPress={handleGoBack} />
             <View style={styles.searchContainer}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#838383" />
            <TextInput
              placeholder="Search here"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        </TouchableOpacity>
      </View>
            <View style={styles.container}>
                {/* Tabs */}
                <View style={styles.tabRow}>
                    {["active", "completed", "cancelled"].map((t) => (
                        <TouchableOpacity key={t} onPress={() => setTab(t)} style={styles.tab}>
                            <Text style={[styles.tabText, tab === t && styles.activeText]}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </Text>
                            {/* Active Line */}
                            {tab === t && <View style={styles.activeLine} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Content */}
                <View style={styles.contentBox}>{renderContent()}</View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: "#fff",
         paddingTop: 30
    },
    scrollContent: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 100,
    }, searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F6F6",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40,
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

    container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
    tabRow: { flexDirection: "row", justifyContent: "space-around" },
    tab: { alignItems: "center", paddingVertical: 10, flex: 1 },
    tabText: { fontSize: 16, color: "#666" },
    activeText: { color: "#000", fontWeight: "600" },
    activeLine: {
        marginTop: 6,
        height: 3,
        width: "90%",
        backgroundColor: "#704F38",
        borderRadius: 2,
    },
    contentBox: {
        flex: 1,
      
    },
    content: {
        fontSize: 18,
        fontWeight: "500",
    },
   
orderCard: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 8,
  padding: 12,
},
image: {
  width: 80,
  height: 80,
  borderRadius: 10,
  marginRight: 12,
  backgroundColor: "#f0f0f0",
},
details: {
  flex: 1,
},
title: {
  fontSize: 14,
  fontWeight: "600",
  color: "#000",
  marginBottom: 2,
},
subText: {
  color: "#858585",
  fontSize: 12,
  marginBottom: 6,
},
rowBetween: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
price: {
  fontSize: 14,
  fontWeight: "600",
  color: "#704F38",
},
button: {
  backgroundColor: "#704F38",
  borderRadius: 20,
  paddingVertical: 6,
  paddingHorizontal: 14,
},
buttonText: {
  fontSize: 11,
  fontWeight: "500",
  color: "#fff",
},
});

export default OrdersScreen;
