import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width: customWidth = "100%",
  height = 20,
  borderRadius = 8,
  style = {},
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        styles.container,
        { width: customWidth, height, borderRadius },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
          styles.shimmer,
        ]}
      />
    </View>
  );
};

/** 👉 Variants built using Skeleton **/

// Circular skeleton (e.g., profile image)
export const SkeletonCircle = ({ size = 50, style = {} }) => (
  <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />
);

// Text skeleton (long line)
export const SkeletonText = ({ width = "90%", height=20, style = {} }) => (
  <Skeleton width={width} height={height} borderRadius={4} style={style} />
);

// Small text line
export const SkeletonTextSmall = ({ width = "60%", style = {} }) => (
  <Skeleton width={width} height={10} borderRadius={3} style={style} />
);

// Rectangular card skeleton
export const SkeletonCard = ({ width = "100%", height = 150, style = {} }) => (
  <Skeleton width={width} height={height} borderRadius={12} style={style} />
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E1E9EE",
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: "50%",
    opacity: 0.5,
  },
});

export default Skeleton;
