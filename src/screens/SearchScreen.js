import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { getData } from '../api/pokeapi';
import PokemonCard from '../components/PokemonCard';
import { netinfo } from '../hooks/netInfo';

const SearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [allPokemons, setAllPokemons] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isConnected = netinfo();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const result = await getData(`pokemon?limit=200`);
      const allDetails = await Promise.all(
        result.results.map(item => getData(`pokemon/${item.name}`)),
      );
      setAllPokemons(allDetails);
      setFilteredData(allDetails);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('Error fetching all pokemons:', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [isConnected]);

  const handleSearch = text => {
    setSearch(text);
    if (text === '') {
      setFilteredData(allPokemons);
    } else {
      const filtered = allPokemons.filter(p =>
        p.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const renderItem = ({ item }) => <PokemonCard data={item} />;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Pokémon..."
        value={search}
        onChangeText={handleSearch}
        style={styles.input}
        placeholderTextColor="#666"
      />
      {!isConnected && (
        <Text style={styles.noInternet}>No Internet Connection</Text>
      )}
      {loading && isConnected ? (
        <ActivityIndicator
          size="large"
          color="#1e3c72"
          style={{ marginTop: 20 }}
        />
      ) : filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          keyboardShouldPersistTaps="handled"
          numColumns={2}
          onEndReachedThreshold={0.5}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noResult}>No Pokémon found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#ABC3D6' },
  noInternet: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    borderColor: '#1e3c72',
    borderWidth: 1,
    color: '#000',
  },
  noResult: {
    marginTop: 30,
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
});

export default SearchScreen;
