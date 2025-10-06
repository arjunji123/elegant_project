import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BoxImage from "../../assets/images/box.png"; // adjust path
import Button from "../../components/Button";

const SuccessScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Success</Text>
      </View>

      {/* Content (centered) */}
      <View style={styles.content}>
        <Image source={BoxImage} style={styles.image} />

        <Text style={styles.title}>Your order was successful</Text>
        <Text style={styles.subtitle}>
          Thank you for your purchase, we hope you enjoy the products!
        </Text>
      </View>

      {/* Button */}
      <Button text={"Back to Home"} onPress={() => navigation.navigate("HomePageScreen")}
       bgColor={"#704F38"} textColor={"#FFFFFF"}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  content: {
    flex: 1, // take up remaining space
    justifyContent: "center", // center vertically
    alignItems: "center", // center horizontally
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#6b4226",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SuccessScreen;
