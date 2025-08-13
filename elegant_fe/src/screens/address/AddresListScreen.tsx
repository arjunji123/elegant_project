import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";




const AddresListScreen = () => {

    const [address, setAddress] = useState("")
    const { token } = useAuth();
    const navigation = useNavigation();

    const tokens = { token }
    useEffect(() => {


        console.log("Testing token:", tokens.token);
        // ✅ prevents state updates if unmounted

        const addresstAuth = async () => {
            try {
                const res = await fetch(`http://192.168.1.12:5000/api/addresses`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.token}`,
                    },
                });

                const text = await res.text();


                const data = JSON.parse(text);
                console.log("Response text:", data);
                setAddress(data)

                if (data.success && data.data) {
                    // ✅ Use API result directly to set form fields

                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (tokens?.token) {
            addresstAuth();
        }

    }, []);
    console.log(address.data, "datadatadata")
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Icon name="chevron-back" size={24} />
                <Text style={styles.headerTitle}>My Addresses</Text>
            </View>

            {/* Address List */}
            <ScrollView contentContainerStyle={styles.listContainer}>
                {address?.data?.map((item) => (
                    <View key={item.id} style={styles.addressCard}>
                        <View style={styles.addressLeft}>
                            <View style={styles.iconWrapper}>
                                <Icon name="location-outline" size={20} color="#000" />
                            </View>
                            <View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>{item.title}</Text>
                                    {item.is_default === 1 && (
                                        <View style={styles.defaultTag}>
                                            <Text style={styles.defaultText}>Default</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.address}>{item.address}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() =>
                navigation.navigate("AddressForm", {
                  mode: "edit",
                  addressData: item,
                })
              }>
                            <Icon name="create-outline" size={18} color="#000" />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Add New Address Button */}
                <TouchableOpacity style={styles.addButton}  onPress={() => navigation.navigate("AddressForm", { mode: "add" })}>
                    <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default AddresListScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8", // Full-screen background
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
    },
    listContainer: {
        paddingBottom: 30,
    },
    addressCard: {
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    addressLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconWrapper: {
        backgroundColor: "#F2F2F2",
        padding: 8,
        borderRadius: 8,
        marginRight: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginRight: 6,
    },
    defaultTag: {
        backgroundColor: "#EAEAEA",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 10,
        color: "#555",
    },
    address: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    addButton: {
        backgroundColor: "#6B4423",
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 20,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});