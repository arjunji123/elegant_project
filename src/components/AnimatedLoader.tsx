import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loader = ({ visible = false, color = "#704F38", size = "large" }) => {
  if (!visible) return null;
  return (
    <View style={loaderStyles.overlay}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const loaderStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});

export default Loader;
