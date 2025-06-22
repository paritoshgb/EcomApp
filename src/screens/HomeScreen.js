import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { getData } from '../api/pokeapi';
import { netinfo } from '../hooks/netInfo';
import PokemonCard from '../components/PokemonCard';
import { useTheme } from '@react-navigation/native';

const HomeScreen = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const isConnected = netinfo();
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  const fetchPokemons = async () => {
    if (!isConnected || loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await getData(`pokemon?offset=${offset}&limit=20`);
      console.log('Result:', result);

      if (result && result.results) {
        const details = await Promise.all(
          result.results.map(item => getData(`pokemon/${item.name}`)),
        );
        const filteredDetails = details.filter(Boolean);
        setPokemons(prev => [...prev, ...filteredDetails]);
        setOffset(prev => prev + 20);

        if (result.results.length === 0) setHasMore(false);
      } else {
        setError('Failed to load data from server.');
      }
    } catch (err) {
      console.log('Error:', err);
      setError('Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [isConnected]);

  const renderItem = ({ item }) => <PokemonCard data={item} />;

  const renderShimmer = () => {
    const shimmerArray = [...Array(8)];
    return (
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
        }}
      >
        {shimmerArray.map((_, index) => (
          <ShimmerPlaceholder
            key={index}
            LinearGradient={LinearGradient}
            style={{
              height: 170,
              width: '47%',
              marginVertical: 5,
              borderRadius: 10,
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}
      {pokemons.length === 0 && loading && !error ? renderShimmer() : null}

      {pokemons.length > 0 && (
        <FlatList
          data={pokemons}
          keyExtractor={item => item.id?.toString() ?? item.name}
          renderItem={renderItem}
          numColumns={2}
          onEndReached={() => hasMore && fetchPokemons()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color="#1e3c72" />
              </View>
            ) : null
          }
        />
      )}

      {error && pokemons.length === 0 && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

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
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeScreen;
