import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProductCard = ({
  item,
  isDarkMode = false,
  onRemoveFromFavorites = () => {},
  showFavorite = true,
  isFavoriteFromParent = null,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (isFavoriteFromParent !== null) {
      setIsFavorite(isFavoriteFromParent);
    } else {
      const checkFavorite = async () => {
        const existing = await AsyncStorage.getItem(`fav_${item.id}`);
        setIsFavorite(!!existing);
      };
      checkFavorite();
    }
  }, [item.id, isFavoriteFromParent]);

  const toggleFavorite = async () => {
    const key = `fav_${item.id}`;
    if (isFavorite) {
      await AsyncStorage.removeItem(key);
      setIsFavorite(false);
      ToastAndroid.show('Removed from Favorites!', ToastAndroid.SHORT);
      onRemoveFromFavorites(item);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(item));
      setIsFavorite(true);
      ToastAndroid.show('Added to Favorites!', ToastAndroid.SHORT);
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetail', { productId: item.id })
      }
      style={[styles.card, { backgroundColor: isDarkMode ? '#ccc' : '#fff' }]}
    >
      {showFavorite && (
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.favIconWrapper}
        >
          <Text style={styles.favText}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}

      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text
        numberOfLines={2}
        style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}
      >
        {item.title}
      </Text>
      <Text style={styles.price}>${item.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 10,
    width: '48%',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
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

export default ProductCard;
