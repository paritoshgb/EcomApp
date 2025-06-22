import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../api/pokeapi';
import { netinfo } from '../hooks/netInfo';

const PokemonDetails = ({ route }) => {
  const { pokemon } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [evolChain, setEvolChain] = useState([]);
  const isConnected = netinfo();

  useEffect(() => {
    async function fetchEvolution() {
      const species = await getData(`pokemon-species/${pokemon.id}`);
      const chainRes = await getData(
        `evolution-chain/${
          species.evolution_chain.url.split('/').slice(-2, -1)[0]
        }`,
      );
      const chainArr = [];
      let node = chainRes.chain;
      do {
        chainArr.push({
          name: node.species.name,
          url: node.species.url.replace('pokemon-species', 'pokemon'),
        });
        node = node.evolves_to[0];
      } while (node);
      const fullData = await Promise.all(
        chainArr.map(c => getData(`pokemon/${c.name}`)),
      );
      setEvolChain(fullData);
    }
    fetchEvolution();
  }, []);

  const toggleFavorite = async () => {
    const key = `fav_${pokemon.id}`;
    const current = await AsyncStorage.getItem(key);
    if (current) {
      await AsyncStorage.removeItem(key);
      ToastAndroid.show('You Unliked This Pokemon...!', ToastAndroid.SHORT);
      setIsFavorite(false);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(pokemon));
      setIsFavorite(true);
      ToastAndroid.show('You Liked This Pokemon...!', ToastAndroid.SHORT);
    }
  };

  const checkFavorite = async () => {
    const key = `fav_${pokemon.id}`;
    const current = await AsyncStorage.getItem(key);
    if (current) setIsFavorite(true);
  };

  useEffect(() => {
    checkFavorite();
  }, [isConnected]);

  return (
    <ScrollView style={styles.container}>
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}
      <Image
        source={{
          uri: pokemon.sprites.other['official-artwork'].front_default,
        }}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View style={styles.nameWrapper}>
            <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>
          </View>
          <TouchableOpacity onPress={toggleFavorite}>
            <Text style={styles.favText}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type(s):</Text>
          {pokemon.types.map(t => (
            <Text key={t.slot} style={styles.text}>
              • {t.type.name}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abilities:</Text>
          {pokemon.abilities.map((a, i) => (
            <Text key={i} style={styles.text}>
              • {a.ability.name}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats:</Text>
          {pokemon.stats.map((s, i) => (
            <Text key={i} style={styles.text}>
              • {s.stat.name.toUpperCase()}: {s.base_stat}
            </Text>
          ))}
        </View>
        {evolChain.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evolution Chain:</Text>
            <ScrollView horizontal>
              {evolChain.map(p => (
                <View key={p.id} style={styles.evoItem}>
                  <Image
                    source={{ uri: p.sprites.front_default }}
                    style={styles.evoImage}
                  />
                  <Text style={styles.evoName}>{p.name.toUpperCase()}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ABC3D6' },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'contain',
    marginTop: 20,
  },
  noInternet: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginBottom: 12,
  },
  favText: {
    fontSize: 28,
  },
  nameWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1e3c72',
  },
  text: {
    fontSize: 15,
    marginLeft: 8,
    color: '#333',
  },
  evoItem: { alignItems: 'center', marginRight: 16 },
  evoImage: { width: 80, height: 80 },
  evoName: { marginTop: 4, fontSize: 14, fontWeight: '500' },
});

export default PokemonDetails;
