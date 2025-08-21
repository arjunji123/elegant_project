import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import Arrowleft from "../../assets/icons/Arrowleft.png";
import { useState } from "react";
import CartItem from "../../components/CartItem";

const cartData = [
  {
    id: '1',
    imageUrl: 'https://your-s3-url.com/image1.jpg',
    title: "Men’s Tie-Dye T-Shirt Sportswear",
    price: 16.58,
    size: 'M',
    color: 'Red',
    quantity: 4,
  },
  {
    id: '2',
    imageUrl: 'https://your-s3-url.com/image2.jpg',
    title: "Men’s Tie-Dye T-Shirt Sportswear",
    price: 16.58,
    size: 'M',
    color: 'Red',
    quantity: 1,
  },
  // ...add more items as needed
];

const CardScreen = ({ navigation }) => {
      const [cartItems, setCartItems] = useState(cartData);
  // Handlers for quantity and delete actions
  const handleIncrease = (id) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
    const handleDecrease = (id) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
    const handleDelete = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
    const handleGoBack = () => {
        navigation.goBack();

    };
    return (
        <View style={styles.rootContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Pressable onPress={handleGoBack} style={styles.backButton}>
                        <Image source={Arrowleft} style={styles.backIcon} />
                    </Pressable>

                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>My Cart</Text>
                    </View>
                </View>

                 <View style={styles.bg}>

                    <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CartItem
            imageUrl={item.imageUrl}
            title={item.title}
            price={item.price}
            size={item.size}
            color={item.color}
            quantity={item.quantity}
            onIncrease={() => handleIncrease(item.id)}
            onDecrease={() => handleDecrease(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      />
                 </View>
    
            </ScrollView>
        </View>
    )

}

export default CardScreen

const styles = StyleSheet.create({

    rootContainer: {
        flex: 1,
        backgroundColor: '#fff', // Full page background color here
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: { flexDirection: "row", alignItems: "center" },
    titleContainer: { flex: 1, alignItems: "center" },
    backButton: { padding: 2 },
    backIcon: { width: 29, height: 29, resizeMode: "contain" },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "Poppins",
    },
    bg: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingVertical: 8,
  }
})