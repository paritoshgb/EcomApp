import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getData } from '../api/ecomapi';
import { useAppTheme } from '../utils/useAppTheme';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import ProductCard from '../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductListing = () => {
  const { colors, isDarkMode, isConnected } = useAppTheme();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [favoritesMap, setFavoritesMap] = useState({});

  const checkFavorites = async list => {
    const favMap = {};
    for (let product of list) {
      const fav = await AsyncStorage.getItem(`fav_${product.id}`);
      if (fav) favMap[product.id] = true;
    }
    setFavoritesMap(favMap);
  };

  useFocusEffect(
    useCallback(() => {
      if (products.length > 0) checkFavorites(products);
    }, [products]),
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getData('products');
    if (result && Array.isArray(result)) {
      setProducts(result);
      setFilteredProducts(result);
    }
    setLoading(false);
  };

  const handleSearch = text => {
    setSearch(text);
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredProducts(filtered);
  };

  const handleSort = () => {
    const sorted = [...filteredProducts].sort((a, b) =>
      sortAsc ? a.price - b.price : b.price - a.price,
    );
    setFilteredProducts(sorted);
    setSortAsc(!sortAsc);
  };

  const renderShimmer = () => (
    <View style={styles.shimmerContainer}>
      {[...Array(6)].map((_, index) => (
        <ShimmerPlaceholder
          key={index}
          LinearGradient={LinearGradient}
          style={styles.shimmerItem}
        />
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <ProductCard
      item={item}
      isDarkMode={isDarkMode}
      showFavorite={true}
      isFavoriteFromParent={favoritesMap[item.id]}
      onRemoveFromFavorites={() => removeFromFavoriteLocally(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}

      <View style={styles.searchRow}>
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search product..."
          placeholderTextColor={colors.subText}
          style={[
            styles.searchInput,
            { color: colors.text, borderColor: colors.subText },
          ]}
        />
        <TouchableOpacity onPress={handleSort} style={styles.sortButton}>
          <Text style={{ color: '#fff' }}>
            {sortAsc ? 'Price Sort ↑' : 'Price Sort ↓'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        renderShimmer()
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.text }]}>
              No products found.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  noInternet: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  shimmerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shimmerItem: {
    width: '48%',
    height: 180,
    borderRadius: 12,
    marginVertical: 8,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  sortButton: {
    marginLeft: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#1e3c72',
    borderRadius: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default ProductListing;
