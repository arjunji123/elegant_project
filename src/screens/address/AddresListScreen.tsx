import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../Context/AuthContext";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Header from "../../components/Header";

const AddressListScreen = () => {
  const [addresses, setAddresses] = useState([]);
  const { token } = useAuth();
  const navigation = useNavigation();
  const tokens = { token };

  useEffect(() => {
    const fetchAddresses = async () => {
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

        if (data.success && data.data) {
          setAddresses(data.data);
        } else {
          console.error("Error fetching addresses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (tokens?.token) fetchAddresses();
  }, []);

  // Back button handler
  const handleGoBack = () => {
    // Ensures back goes directly to AccountScreen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "AccountScreen" }],
      })
    );
  };

  // Navigate to Add/Edit Address
  const handleAddEditAddress = (mode: "add" | "edit", addressData?: any) => {
    navigation.navigate("AddressForm", { mode, addressData });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header text={"Address"} onPress={handleGoBack} />

      {/* Address List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {addresses.length === 0 ? (
          <Text style={styles.emptyText}>No address found</Text>
        ) : (
          addresses.map((item) => (
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
                  <Text style={styles.address}>
                    {item.street} {item.flat_no} {item.city} {item.state} {item.pincode}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleAddEditAddress("edit", item)}>
                <Icon name="create-outline" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add New Address Button fixed at bottom */}
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddEditAddress("add")}>
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  listContainer: {
    paddingBottom: 100, // enough space for button
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
    flex: 1,
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
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#6B4423",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
});
