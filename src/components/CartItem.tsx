import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CartItem = ({
  imageUrl,
  title,
  price,
  size,
  color,
  quantity,
  onDecrease,
  onIncrease,
  onDelete,
}) => (
  <View style={styles.card}>
    <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
    <View style={styles.info}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.meta}>Size: {size}</Text>
        <Text style={styles.meta}>Color: {color}</Text>
      </View>
      <Text style={styles.price}>${price}</Text>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
          <Text style={styles.qtySymbol}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
          <Text style={styles.qtyPlus}>+</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.trashBtn} onPress={onDelete}>
          <Icon name="trash-2" size={22} color="#bdbdbd" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 13,
    marginHorizontal: 12,
    marginTop: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 10,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#f9f9f9'
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#222',
    marginBottom: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  meta: {
    color: '#929292',
    fontSize: 12,
    marginRight: 10,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginBottom: 8,
    marginTop: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#704F38',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  qty: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 8,
    color: '#222',
    minWidth: 18,
    textAlign: 'center',
  },
  qtySymbol: {
    color: '#222',
    fontWeight: '600',
    fontSize: 16,
  },
  qtyPlus: {
    color: '#fff',
    backgroundColor: '#704F38',
    borderRadius: 14,
    width: 21,
    height: 21,
    textAlign: 'center',
    lineHeight: 21,
    fontWeight: 'bold',
    fontSize: 16,
    overflow: 'hidden',
  },
  trashBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CartItem;
