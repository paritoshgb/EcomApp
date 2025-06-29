import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { useAppTheme } from '../utils/useAppTheme';
import { getData } from '../api/ecomapi';
import BannerCarousel from '../components/BannerCarousel';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const bgColors = ['#FFEFD5', '#E6E6FA', '#F0FFF0', '#FFF0F5'];

const HomeScreen = () => {
  const { colors, isDarkMode, isConnected } = useAppTheme();
  const navigation = useNavigation();

  const banners = [
    require('../Images/banner1.jpg'),
    require('../Images/banner2.jpg'),
    require('../Images/banner3.jpg'),
  ];
  const advertise = [
    require('../Images/banner21.jpg'),
    require('../Images/banner22.jpg'),
    require('../Images/banner23.jpg'),
  ];
  const categories = [
    { id: '1', name: 'Fruits', image: require('../Images/category1.png') },
    { id: '2', name: 'Vegetables', image: require('../Images/category2.png') },
    { id: '3', name: 'Gadgets', image: require('../Images/category3.png') },
    { id: '4', name: 'Soft Drinks', image: require('../Images/category4.png') },
    { id: '5', name: 'Mens Care', image: require('../Images/category5.png') },
  ];

  const [products, setProducts] = useState([]);
  const [productsTrending, setProductsTrending] = useState([]);
  const [DealsProducts, setDealsProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = async product => {
    const key = `fav_${product.id}`;
    const current = await AsyncStorage.getItem(key);
    let updatedFavorites = { ...favorites };

    if (current) {
      await AsyncStorage.removeItem(key);
      delete updatedFavorites[product.id];
      ToastAndroid.show('Removed from Favorites!', ToastAndroid.SHORT);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(product));
      updatedFavorites[product.id] = true;
      ToastAndroid.show('Added to Favorites!', ToastAndroid.SHORT);
    }

    setFavorites(updatedFavorites);
  };

  const checkFavorites = async productList => {
    const favMap = {};
    for (let product of productList) {
      const fav = await AsyncStorage.getItem(`fav_${product.id}`);
      if (fav) favMap[product.id] = true;
    }
    setFavorites(favMap);
  };

  const fetchProducts = async () => {
    if (!isConnected || loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await getData('products');
      if (result && Array.isArray(result)) {
        const prod = result.slice(0, 5);
        const trending = result.slice(5, 10);
        const deal = result.slice(10, 15);
        setProducts(prod);
        setProductsTrending(trending);
        setDealsProducts(deal);
        checkFavorites([...prod, ...trending, ...deal]);
      } else {
        setError('No data found.');
      }
    } catch (err) {
      console.log('Fetch error:', err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      const all = [...products, ...productsTrending, ...DealsProducts];
      if (all.length > 0) {
        checkFavorites(all);
      }
    }, [products, productsTrending, DealsProducts]),
  );

  const renderFullPageShimmer = () => (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          width: '100%',
          height: 180,
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <ShimmerPlaceholder
            key={i}
            LinearGradient={LinearGradient}
            style={{
              width: 80,
              height: 80,
              borderRadius: 100,
              marginRight: 12,
            }}
          />
        ))}
      </View>

      <Text style={[styles.subtitle, { color: colors.text }]}>
        Recommended for you
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {[1, 2, 3].map(i => (
          <ShimmerPlaceholder
            key={i}
            LinearGradient={LinearGradient}
            style={{
              width: 160,
              height: 180,
              borderRadius: 12,
              marginRight: 12,
            }}
          />
        ))}
      </View>

      <Text style={[styles.subtitle, { color: colors.text }]}>
        Trending Products
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {[1, 2, 3].map(i => (
          <ShimmerPlaceholder
            key={i}
            LinearGradient={LinearGradient}
            style={{
              width: 160,
              height: 180,
              borderRadius: 12,
              marginRight: 12,
            }}
          />
        ))}
      </View>
    </ScrollView>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetail', { productId: item.id })
      }
      style={[
        styles.recommendCard,
        { backgroundColor: isDarkMode ? '#ccc' : '#fff' },
      ]}
    >
      <TouchableOpacity
        onPress={() => toggleFavorite(item)}
        style={styles.favIconWrapper}
      >
        <Text style={styles.favText}>{favorites[item.id] ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: item.image }}
        style={styles.recommendImage}
        resizeMode="contain"
      />
      <Text
        numberOfLines={2}
        style={[styles.recommendTitle, { color: isDarkMode ? '#fff' : '#000' }]}
      >
        {item.title}
      </Text>
      <Text style={styles.recommendPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return loading ? (
    renderFullPageShimmer()
  ) : (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}

      <Text style={[styles.title, { color: colors.text }]}>Hello Harry</Text>

      <BannerCarousel images={banners} />

      <Text style={[styles.subtitle, { color: colors.text }]}>Categories</Text>

      <View style={{ height: 100 }}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const bg = bgColors[Math.floor(Math.random() * bgColors.length)];
            return (
              <TouchableOpacity
                style={[styles.categoryBox, { backgroundColor: bg }]}
              >
                <Image
                  source={item.image}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
        Recommended for you
      </Text>

      <FlatList
        horizontal
        data={products}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />

      <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
        Trending Products
      </Text>

      <FlatList
        horizontal
        data={productsTrending}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />

      <BannerCarousel images={advertise} type="ad" />

      <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
        Deals of Products
      </Text>

      <FlatList
        horizontal
        data={DealsProducts}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 10 },
  subtitle: { fontSize: 20, marginVertical: 16, fontWeight: '600' },
  noInternet: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryBox: {
    alignItems: 'center',
    marginRight: 8,
    padding: 5,
    borderRadius: 100,
    width: 80,
    height: 80,
  },
  categoryImage: {
    width: 80,
    height: 80,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  recommendCard: {
    borderRadius: 12,
    padding: 10,
    width: 160,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  recommendImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  recommendTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  favIconWrapper: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 2,
    paddingVertical: 2,
    elevation: 5,
  },
  favText: {
    fontSize: 18,
  },
});

export default HomeScreen;
