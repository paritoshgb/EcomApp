import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkFirstTime = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setTimeout(() => {
        if (hasLaunched === null) {
          AsyncStorage.setItem('hasLaunched', 'true');
          navigation.replace('GetStarted');
        } else {
          navigation.replace('MainTabs');
        }
      }, 2500);
    };
    checkFirstTime();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3c72',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
});

export default SplashScreen;
