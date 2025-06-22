import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const GetStartedScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.brand}>Pokedex</Text>
        <Text style={styles.subtitle}>
          Catch, Search and Explore Pokémon World!
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            })
          }
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text
        style={{
          fontSize: 16,
          color: '#fff',
          textAlign: 'center',
          top: 200,
          margin: 10,
        }}
      >
        (This is GetStarted Screen which comes first time when u started the
        app...)
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '300',
  },
  brand: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#eee',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#F44336',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 50,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen;
