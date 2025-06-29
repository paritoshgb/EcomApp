import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';
import { useAppTheme } from '../utils/useAppTheme';
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const { colors, isDarkMode, isConnected } = useAppTheme();

  const loadFavorites = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const favKeys = keys.filter(k => k.startsWith('fav_'));
    const favItems = await AsyncStorage.multiGet(favKeys);
    const parsed = favItems.map(([_, value]) => JSON.parse(value));
    setFavorites(parsed);
  };

  const handleRemove = item => {
    const updated = favorites.filter(prod => prod.id !== item.id);
    setFavorites(updated);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  const renderItem = ({ item }) => (
    <ProductCard
      item={item}
      isDarkMode={isDarkMode}
      onRemoveFromFavorites={handleRemove}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}
      {favorites.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No favorites yet.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
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
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '600',
  },
});

export default FavoritesScreen;
