import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { getData } from '../api/ecomapi';
import { useAppTheme } from '../utils/useAppTheme';
import NetInfo from '@react-native-community/netinfo';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const ProductDetail = ({ route }) => {
  const { productId } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cart = useSelector(state => state.cart);
  const isInCart = cart[productId] !== undefined;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    fetchProduct();
    return () => unsubscribe();
  }, []);

  const fetchProduct = async () => {
    setLoading(true);
    const result = await getData(`products/${productId}`);
    if (result && result.id) {
      setProduct(result);
      checkFavorite(result.id);
    }
    setLoading(false);
  };

  const checkFavorite = async id => {
    const fav = await AsyncStorage.getItem(`fav_${id}`);
    setIsFavorite(!!fav);
  };

  const toggleFavorite = async () => {
    const key = `fav_${productId}`;
    if (isFavorite) {
      await AsyncStorage.removeItem(key);
      ToastAndroid.show('Removed from Favorites!', ToastAndroid.SHORT);
      setIsFavorite(false);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(product));
      ToastAndroid.show('Added to Favorites!', ToastAndroid.SHORT);
      setIsFavorite(true);
    }
  };

  const addToCart = () => {
    dispatch({
      type: 'ADD_CART',
      payload: [product.id, { ...product, quantity: 1 }],
    });
    ToastAndroid.show('Added to Cart!', ToastAndroid.SHORT);
    navigation.navigate('Home', { screen: 'Cart' });
  };

  const renderShimmer = () => (
    <ScrollView style={{ padding: 16 }}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.image}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ height: 20, width: '80%', marginVertical: 10 }}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ height: 20, width: '60%', marginBottom: 10 }}
      />
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ height: 100, borderRadius: 8 }}
      />
    </ScrollView>
  );

  if (loading) return renderShimmer();
  if (!product) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}

      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.topIconsRow}>
          <TouchableOpacity
            style={styles.favIconWrapper}
            onPress={toggleFavorite}
          >
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={28}
              color={isFavorite ? 'red' : isDarkMode ? '#000' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartIconWrapper} onPress={addToCart}>
            <Icon
              name={isInCart ? 'shopping-cart' : 'add-shopping-cart'}
              size={28}
              color={isDarkMode ? '#000' : '#000'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.price, { color: '#e91e63' }]}>${product.price}</Text>
      <Text style={[styles.name, { color: colors.text }]}>{product.title}</Text>

      <Text style={[styles.label, { color: colors.subText }]}>Description</Text>
      <Text
        style={[styles.description, { color: colors.text, marginBottom: 30 }]}
      >
        {product.description}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  noInternet: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  topIconsRow: {
    flexDirection: 'column',
    gap: 25,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
  },
  favIconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 5,
    paddingVertical: 5,
    elevation: 5,
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  cartIconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    elevation: 5,
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default ProductDetail;
