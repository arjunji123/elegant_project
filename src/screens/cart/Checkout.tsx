import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Header from "../../components/Header"
import { useNavigation } from "@react-navigation/native";
import jacket from '../../assets/images/jacket.png'
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import Arrowleft from "../../assets/icons/Arrowleft.png";
import RazorpayCheckout from 'react-native-razorpay';
import { useToast } from "../../Context/ToastContext";





const Checkout: React.FC<CartItemProps> = () => {
    const navigation = useNavigation();
    const [cartData, setCartData] = useState([])
    const [address, setAddress] = useState([])
    const [refresh, setRefresh] = useState(false);
    const [orderSummery, setOrderSummery] = useState([])
    const [orderCreated, setOrderCreated] = useState([])
    const { showToast } = useToast();
    const [id, setId] = useState("")
    const { token, addressId } = useAuth();
    const tokens = { token }
    const subtotal = 75.58;
    const discount = -5.5;
    const deliveryFee = 5.0;
    const total = subtotal + discount + deliveryFee;


    useEffect(() => {

        const fetchCart = async () => {
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

                } else {
                    console.error("Error fetching user:", data.message);
                }

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
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
        orderSummer();
        fetchCart();
        fetchaddress();
    }, [refresh, id])


    useEffect(() => {
        const DeleteProduct = async () => {
            try {
                const res = await fetch(`https://elegant-project.onrender.com/api/cart/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                });
                const text = await res.text();
                console.log(id, text, "deletedeteled")

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        DeleteProduct()
    }, [id])


    const handleGoBack = () => {
        navigation.goBack()
    };
    const CreateOrder = async () => {
        try {
            // pick default address
            const defaultAddress = address.find(a => a.is_default === 1);
            const SelectedAddress = address.filter(item => item.id === addressId).map((item) => item.id)
console.log(SelectedAddress,"defaultAddress")
            const payload = {
                address_id:addressId ?  SelectedAddress :defaultAddress.id,
                products: cartData.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color,
                    image_url: item.product.images[0],
                })),
                summary: orderSummery,
                coupon: { id: 2 }
            };

            const res = await fetch(`https://elegant-project.onrender.com/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Order created after success", payload);

            if (data.success) {
                // after order created → open Razorpay
                setOrderCreated(data);
                return data; // 👈 Add this line to return the data
            } else {
                showToast(`Order creation failed:${data.error}`, "error");
                // Consider returning null or an empty object on failure
                return null;
            }
        } catch (error) {
            console.error("Error creating order:", error);
            showToast("Error creating order");
            // Ensure something is returned in the catch block too
            return null;
        }
    };
    const Payment = async () => {
        try {
            const order = await CreateOrder();
            console.log(order, "orderorder")
            const options = {
                description: 'Order Payment',
                image: 'https://i.imgur.com/3g7nmJC.jpg',
                currency: 'INR',
                key: 'rzp_test_RHsHXl1snWI43a', // your Razorpay key
                amount: Math.round(orderSummery.total * 100),
                order_id: order.razorpayOrderId,
                name: 'Elegant Store',

                prefill: {
                    email: 'sonal@example.com',
                    contact: '+919876543210',
                    name: 'Sonal Singh'
                },
                theme: { color: '#53a20e' }
            };

            RazorpayCheckout.open(options)
                .then(async (data) => {
                    // ✅ Payment Success
                    console.log("Payment success:", data);

                    try {
                        const verifyRes = await fetch("https://elegant-project.onrender.com/api/orders/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${tokens.token}`,
                            },
                            body: JSON.stringify({
                                razorpay_order_id: data.razorpay_order_id,
                                razorpay_payment_id: data.razorpay_payment_id,
                                razorpay_signature: data.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        console.log(verifyData, "verifyDataverifyData")
                        if (verifyData.success) {
                            navigation.navigate("OrderSuccessfull")
                            showToast(`Payment Verified! Order placed ✅`, "success");
                        } else {
                            showToast("Payment verification failed ❌", "error");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        showToast("Error verifying payment");
                    }
                })
        } catch (error) {
            console.log("Payment failed:", error);
        }

    };

    console.log(orderCreated, 'cartDatacartData')
    return (
        <View style={styles.container}>
            <Header text={"Checkout"} onPress={handleGoBack} />
            <ScrollView >
                {/* Address */}
                <View>
                    <View style={styles.Address}>
                        <Text style={styles.AddressTesxt}>Delivery Address</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("SelectAddressScreen")}>
                            <Image source={Arrowleft} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.addresscontainer}>
                        {/* Left: Address Icon */}
                        <Icon name="location-outline" size={24} style={{ margin: 5 }} />

                        {addressId ? address.filter(item => item.id === addressId)
                            .map(item => (
                                
                                <><View style={styles.textContainer}>
                                    <Text style={styles.addressText}>{item.title}</Text>
                                    <Text style={styles.titleText}>{item.street} {item.flat_no} {item.city}  {item.state}</Text>
                                </View>
                                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SelectAddressScreen")}>
                                        <Text style={styles.text}>Change</Text>
                                    </TouchableOpacity>
                                    {/* <Icon name="checkmark-circle" size={22} color="green" /> */}
                                </>
                            )) : address.slice(0, 1)
                                .map(item => (

                                    <><View style={styles.textContainer}>
                                        <Text style={styles.addressText}>{item.title}</Text>
                                        <Text style={styles.titleText}>{item.street} {item.flat_no} {item.city}  {item.state}</Text>
                                    </View>
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SelectAddressScreen")}>
                                            <Text style={styles.text}>Change</Text>
                                        </TouchableOpacity>
                                    </>
                                ))}

                    </TouchableOpacity>
                </View>
                <View style={styles.Address}>
                    <Text style={styles.AddressTesxt}>Order List</Text>

                </View>
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

                            </View>
                        </View>

                        {/* Divider outside card */}
                        {index < cartData.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}


                {/* Payment Summery */}
                <View style={styles.paycontainer}>


                    {/* Checkout Button */}
                    <TouchableOpacity style={styles.checkoutButton} onPress={() => Payment()}>
                        <Text style={styles.checkoutText}>Payment</Text>
                    </TouchableOpacity>
                </View>
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
    button: {
        borderWidth: 1,
        borderColor: "#aaa", // grey border
        borderRadius: 25, // rounded corners
        paddingVertical: 6,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    text: {
        fontSize: 10,
        fontWeight: "400",
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
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
        // fontFamily:"Poppins",
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
})
export default Checkout