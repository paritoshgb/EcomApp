import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PokemonCard = ({ data }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { pokemon: data })}
      style={styles.card}
    >
      <Image
        source={{ uri: data.sprites.front_default }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{data.name.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#C5E0D3',
    borderRadius: 12,
    marginVertical: 5,
    marginHorizontal: 8,
    padding: 10,
    width: '45%',
    height: 150,
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  details: {
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PokemonCard;
