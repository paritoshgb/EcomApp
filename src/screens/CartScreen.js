import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import { useAppTheme } from '../utils/useAppTheme';
import { useSelector, useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { colors, isDarkMode } = useAppTheme();
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  }, []);

  useEffect(() => {
    const items = Object.values(cart).map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(items);
  }, [cart, isFocused]);

  const increaseQty = item => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    dispatch({ type: 'ADD_CART', payload: [item.id, updatedItem] });
  };

  const decreaseQty = item => {
    if (item.quantity <= 1) {
      dispatch({ type: 'DELETE_CART', payload: [item.id] });
      ToastAndroid.show('Item Removed', ToastAndroid.SHORT);
    } else {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      dispatch({ type: 'ADD_CART', payload: [item.id, updatedItem] });
    }
  };

  const clearCart = () => {
    Alert.alert('Clear Cart?', 'Are you sure you want to clear your cart?', [
      { text: 'Cancel' },
      {
        text: 'Clear',
        onPress: () => dispatch({ type: 'CLEAR_CART' }),
        style: 'destructive',
      },
    ]);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const renderItem = ({ item }) => (
    <View
      style={[styles.card, { backgroundColor: isDarkMode ? '#ccc' : '#fff' }]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={() => decreaseQty(item)}
            style={styles.qtyBtn}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => increaseQty(item)}
            style={styles.qtyBtn}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}

      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: colors.text }]}>Your Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
            }}
          >
            <Image
              style={{
                resizeMode: 'contain',
                width: 250,
                height: 250,
              }}
              source={require('../Images/notfound.png')}
            />

            <Text style={[styles.empty, { color: colors.subText }]}>
              Your cart is empty.
            </Text>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.checkoutBox}>
          <Text style={styles.total}>Total: ${totalAmount.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() =>
              navigation.navigate('Checkout', {
                amount: totalAmount,
              })
            }
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  noInternet: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    marginVertical: 8,
    padding: 10,
    borderRadius: 12,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#1e3c72',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    elevation: 15,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  checkoutBtn: {
    backgroundColor: '#1e3c72',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CartScreen;
