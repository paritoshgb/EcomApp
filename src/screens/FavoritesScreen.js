import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PokemonCard from '../components/PokemonCard';
import { netinfo } from '../hooks/netInfo';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const isConnected = netinfo();

  const loadFavs = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const favKeys = keys.filter(k => k.startsWith('fav_'));
    const items = await AsyncStorage.multiGet(favKeys);
    setFavorites(items.map(i => JSON.parse(i[1])));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavs);
    return unsubscribe;
  }, [navigation, isConnected]);

  if (!favorites.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No favorites yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}
      <FlatList
        data={favorites}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
};
const renderItem = ({ item }) => <PokemonCard data={item} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#ABC3D6',
  },
  noInternet: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  center: {
    flex: 1,
    paddingTop: 10,
    alignSelf: 'center',
  },
  empty: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default FavoritesScreen;
