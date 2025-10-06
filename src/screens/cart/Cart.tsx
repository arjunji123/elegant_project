import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Header from "../../components/Header"
import { useNavigation,  } from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import Arrowleft from "../../assets/icons/Arrowleft.png";
import AddressIcon from '../../assets/images/addressIcons.png'
import visa from '../../assets/images/visa.png'
import Skeleton, { SkeletonCard, SkeletonText } from "../../components/Skeleton";






const Cart: React.FC<CartItemProps> = () => {
    const navigation = useNavigation();
    const [cartData, setCartData] = useState([])
    const [address, setAddress] = useState([])
    const [refresh, setRefresh] = useState(false);
    const [loader, setLoader] = useState(false);

    const [orderSummery, setOrderSummery] = useState([])
    const [coupon, setCoupon] = useState([])
    const [couponId, setCouponId] = useState(Number)

    const [id, setId] = useState("")
    const { token, addressId } = useAuth();
    const tokens = { token }
    useEffect(() => {
        const fetchCart = async () => {
            setLoader(true)
            try {
                const res = await fetch(`https://elegant-project.onrender.com/api/cart`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                });
                const text = await res.text();


                const data = JSON.parse(text);
                console.log("Response text:", data);
                if (data.success && data.data) {
                    setCartData(data.data)
                    setLoader(false)

                } else {
                    console.error("Error fetching user:", data.message);
                }

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchCart();
    }, [id, refresh])

    useEffect(() => {


        const fetchaddress = async () => {
            try {
                const res = await fetch(`https://elegant-project.onrender.com/api/addresses`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                });
                const text = await res.text();


                const data = JSON.parse(text);
                console.log("Response address:", data.data);
                if (data.success && data.data) {
                    setAddress(data.data)

                } else {
                    console.error("Error fetching user:", data.message);
                }

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        const orderSummer = async () => {
            try {
                const res = await fetch(`https://elegant-project.onrender.com/api/cart/summary`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                });
                const text = await res.text();
                const data = JSON.parse(text);
                console.log("Response text:", data);
                if (data.success && data.summary) {
                    setOrderSummery(data.summary)

                } else {
                    console.error("Error fetching user:", data.message);
                }

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        const FetchCoupon = async () => {
            try {
                const res = await fetch(`https://elegant-project.onrender.com/api/user/coupons`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                });
                const text = await res.text();
                const data = JSON.parse(text);
                console.log("Response text:", data);
                if (data.success && data.coupons) {
                    setCoupon(data.coupons)

                } else {
                    console.error("Error fetching user:", data.message);
                }

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        const updateCoupon = async (cartId: number) => {
            try {
                const res = await fetch(`https://elegant-project.onrender.com/api/apply-coupon`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                    body: JSON.stringify({
                        couponId: cartId,
                    }),
                });
                const data = await res.json();
                console.log(coupon, "cartDatacartData");
            } catch (error) {
                console.error("Error updating Coupon:", error);
            }
        };
        orderSummer();

        fetchaddress();
        FetchCoupon();
        updateCoupon(couponId);

    }, [refresh, id, couponId])

    const updateQuantity = async (cartId: number, newQuantity: number) => {
        try {
            const res = await fetch(`https://elegant-project.onrender.com/api/cart/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokens.token}`,
                },
                body: JSON.stringify({
                    cartId: cartId,
                    quantity: newQuantity,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setRefresh(prev => !prev); // toggle to re-run useEffect
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };
    if (loader) {
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
    const handleDelete = async (cartId: number) => {
  try {
    const res = await fetch(`https://elegant-project.onrender.com/api/cart/${cartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.token}`,
      },
    });

    const text = await res.text();
    console.log("Deleted:", cartId, text);

    // Update UI immediately
    setCartData((prev) => prev.filter((item) => item.cart_id !== cartId));

    // Optional: also refresh from backend
    setRefresh((prev) => !prev);
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

    const handleGoBack = () => {
navigation.popToTop();
    };
    return (

        <View style={styles.container}>
            <Header text={"My Cart"} onPress={handleGoBack} />
            <ScrollView
                contentContainerStyle={
                    cartData.length === 0 && { flex: 1, justifyContent: "center", alignItems: "center",paddingBottom: 100,  }
                }
            >                {cartData.length === 0 ? <Text style={styles.emptyCartText}>No product in cart</Text> : <>
                {cartData.map((item, index) => (
                    <View key={item.cart_id ? `cart-${item.cart_id}` : `cart-${index}`}>
                        <View style={styles.cardcontainer}>
                            {/* Product Image */}
                            <Image source={{ uri: item.product.images[0] }} style={styles.image} />

                            {/* Details */}
                            <View style={styles.details}>
                                <Text style={styles.title}>{item.product.name}</Text>
                                <Text style={styles.subText}>Size: {item.size}   Color: {item.color}</Text>
                                <Text style={styles.price}>{item.product.price ? item.product.price : "0.00"}</Text>

                                {/* Quantity Control + Delete */}
                                <View style={styles.qtyRow}>
                                    <View style={styles.qtyContainer}>
                                        <TouchableOpacity style={styles.qtyButton} onPress={() =>
                                            item.quantity > 1 && updateQuantity(item.cart_id, item.quantity - 1)
                                        }>
                                            <Text style={styles.qtyButtonText}>−</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.qtyText}>{item.quantity}</Text>

                                        <TouchableOpacity
                                            style={[styles.qtyButton, styles.plusButton]}
                                            onPress={() => updateQuantity(item.cart_id, item.quantity + 1)}
                                        >
                                            <Text style={[styles.qtyButtonText, { color: "#fff" }]}>+</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Delete Button */}
                                    <TouchableOpacity
                                       onPress={() => handleDelete(item.cart_id)}
                                        style={styles.deleteButton}
                                    >
                                        <Icon name="trash-outline" size={20} color="#aaa" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Divider outside card */}
                        {index < cartData.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}

                <View>
                    <View style={styles.Address}>
                        <Text >Delivery Address</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("SelectAddressScreen")}>
                            <Image source={Arrowleft} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    {address.length == 0 ? <TouchableOpacity style={styles.addresscontainer}
                        onPress={() => navigation.navigate("AddressForm")}>
                        <Text style={styles.addAddress}>Add Address</Text>
                    </TouchableOpacity> :
                        <TouchableOpacity style={styles.addresscontainer}>
                            <Image source={AddressIcon} style={styles.addressIcon} />
                            {addressId ? address.filter(item => item.id === addressId)
                                .map(item => (
                                    <><View style={styles.textContainer}>
                                      <Text style={styles.addressText}>{item.street} {item.flat_no} {item.city}  {item.state}</Text>
                                            <Text style={styles.titleText}>{item.title}</Text>
                                    </View><Icon name="checkmark-circle" size={22} color="green" /></>
                                )) : address.slice(0, 1)
                                    .map(item => (
                                        <><View style={styles.textContainer}>
                                            <Text style={styles.addressText}>{item.street} {item.flat_no} {item.city}  {item.state}</Text>
                                            <Text style={styles.titleText}>{item.title}</Text>
                                        </View><Icon name="checkmark-circle" size={22} color="green" /></>
                                    ))}

                        </TouchableOpacity>
                    }

                </View>
                <View>
                    <View style={styles.Address}>
                        <Text >Payment Method</Text>
                        <Image source={Arrowleft} style={styles.icon} />

                    </View>
                    <TouchableOpacity style={styles.addresscontainer}>
                        <Image source={visa} style={styles.addressIcon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.addressText}>Smart Cart</Text>
                            <Text style={styles.titleText}>**** **** **** 2653</Text>
                        </View><Icon name="checkmark-circle" size={22} color="green" />
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={styles.Address}>
                        <Text >Apply Coupon Code</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("CouponScreen")}>
                            <Image source={Arrowleft} style={styles.icon} />
                        </TouchableOpacity>

                    </View>
                    {coupon.map((item) => (item.user_status == "applied" &&
                        <TouchableOpacity style={styles.addresscontainer} key={item.id}>
                            <Image source={visa} style={styles.addressIcon} />
                            <View style={styles.textContainer}>
                                <Text style={styles.addressText}>{item.title}</Text>
                                <Text style={styles.titleText}>{item.description}</Text>
                            </View>
                            {item.user_status == "applied" ? <Icon name="checkmark-circle" size={22} color="green" /> :
                                <TouchableOpacity onPress={() => setCouponId(item.id)}>

                                    <Text style={styles.applyButton}>Apply</Text>
                                </TouchableOpacity>
                            }
                        </TouchableOpacity>
                    ))

                    }

                </View>

                <View style={styles.paycontainer}>
                    <Text style={styles.heading}>Payment Summary</Text>



                    <View style={styles.row}>
                        <Text style={styles.label}>Subtotal</Text>
                        <Text style={styles.value}>₹{orderSummery.subtotal}</Text>
                    </View>


                    <View style={styles.row}>
                        <Text style={styles.label}>Coupon discount</Text>
                        <Text style={styles.discount}>₹{orderSummery.coupon_discount}</Text>
                    </View>


                    <View style={styles.row}>
                        <Text style={styles.label}>Delivery Fee</Text>
                        <Text style={styles.value}>{orderSummery.delivery_charge}</Text>
                    </View>


                    <View style={styles.Paydivider} />


                    <View style={styles.row}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>{orderSummery.total}</Text>
                    </View>


                    <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('CheckoutScreen')}>
                        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>



            </>

                }


            </ScrollView>
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8", // Full-screen background
        paddingHorizontal: 16,
        paddingTop: 30
    },
    cardcontainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",  // <-- new

        padding: 5,
        margin: 5,
    },

    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginRight: 10,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
    },
    subText: {
        fontSize: 12,
        color: "#666",
        marginVertical: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 4,
    },
    qtyContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    qtyButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center",
    },
    plusButton: {
        backgroundColor: "#6b4226", // brown-ish button
    },
    qtyButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    qtyText: {
        marginHorizontal: 8,
        fontSize: 16,
        fontWeight: "500",
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // pushes qty left & delete right
        marginTop: 8,
    },
    deleteButton: {
        width: 33,
        height: 33,
        borderRadius: 18,              // makes it a circle
        borderWidth: 2,
        borderColor: "#d4d4d4ff",           // same as icon color
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: "#cecbcbff",  // lighter so it looks like a separator
    },
    Address: {
        flexDirection: "row",
        marginTop: 20,
        margin: 10,
        justifyContent: "space-between"
    },
    AddressTesxt: {
        marginRight: 0
    },
    icon: {
        height: 20,
        width: 15,
        color: "black",
        transform: [{ rotate: "180deg" }]
    },

    addresscontainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 10,
        marginVertical: 8,
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
    paycontainer: {
        borderRadius: 10,
        padding: 16,
    },
    heading: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        color: "#000",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
    label: {
        fontSize: 14,
        color: "#666",
    },
    value: {
        fontSize: 14,
        color: "#000",
    },
    discount: {
        fontSize: 14,
        color: "red",
    },
    Paydivider: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000",
    },
    totalValue: {
        fontSize: 15,
        fontWeight: "700",
        color: "#000",
    },
    checkoutButton: {
        marginTop: 16,
        bottom: 10,
        backgroundColor: "#6b4226", // brown color
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
    },
    checkoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    applyButton: {
        fontSize: 10,
        color: "#704F38",
        fontFamily: "Poppins",
        fontWeight: 400
    },
    addAddress: {
        fontSize: 15,
        fontWeight: 400,
        color: "#704F38"
    },
    emptyCartText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        textAlign: "center",
    },
})
export default Cart