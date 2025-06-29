import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GetStartedScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="bounceIn"
        iterationCount="infinite"
        duration={5000}
        delay={100}
        source={require('../Images/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Animatable.Text animation="fadeInUp" delay={600} style={styles.title}>
        Welcome to E-Shop
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={900} style={styles.subtitle}>
        Get your groceries at your doorstep
      </Animatable.Text>

      <Animatable.View animation="zoomIn" delay={1200}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              await AsyncStorage.setItem('hasLaunched', 'true');
              navigation.replace('Home');
            } catch (error) {
              console.error('Error setting AsyncStorage:', error);
            }
          }}
        >
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={1000}
            style={styles.buttonText}
          >
            Tap to Continue
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a2a2a',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 30,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen;
