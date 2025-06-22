import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from '../screens/Splashscreen';
import GetStartedScreen from '../screens/GetStartedScreen';
import HomeScreen from '../screens/HomeScreen';
import PokemonDetails from '../screens/PokemonDetails';
import FavoritesScreen from '../screens/FavoritesScreen';
import SearchScreen from '../screens/SearchScreen';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 📦 Tab Navigator: Home, Favorites, Search
const BottomTabs = () => {
  const [favCount, setFavCount] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadFavCount = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const favKeys = keys.filter(k => k.startsWith('fav_'));
      setFavCount(favKeys.length);
    };

    if (isFocused) {
      loadFavCount();
    }
  }, [isFocused]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#1e3c72',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          height: 65,
          paddingBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        tabBarBadge:
          route.name === 'Favorites' && favCount > 0 ? favCount : undefined,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home')
            iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Favorites')
            iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Search')
            iconName = focused ? 'search' : 'search-outline';

          return (
            <Animated.View
              style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}
            >
              <Icon name={iconName} size={24} color={color} />
            </Animated.View>
          );
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: '#fff',
        },
        headerStyle: {
          backgroundColor: '#1e3c72',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Pokedex' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen
        name="Details"
        component={PokemonDetails}
        options={{
          headerShown: true,
          title: 'Pokemon Detail',
          headerStyle: {
            backgroundColor: '#1e3c72',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
