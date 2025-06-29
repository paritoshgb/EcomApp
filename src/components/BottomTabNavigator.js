import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProductListing from '../screens/ProductListing';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [favCount, setFavCount] = useState(0);

  const cart = useSelector(state => state.cart);
  const cartCount = Object.keys(cart).length;

  const getFavCount = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const favKeys = keys.filter(k => k.startsWith('fav_'));
    setFavCount(favKeys.length);
  };

  useEffect(() => {
    const interval = setInterval(getFavCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#1e3c72' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        title:
          route.name === 'Home'
            ? 'Welcome to E-Shop App'
            : route.name === 'Favorites'
            ? 'Your Favorites'
            : route.name === 'Cart'
            ? 'Cart'
            : 'All Products',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Products') {
            iconName = focused ? 'bag' : 'bag-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Cart') {
            return (
              <View>
                <Icon
                  name="shopping-cart"
                  size={size}
                  color={focused ? '#e91e63' : 'gray'}
                />
                {cartCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      right: -6,
                      top: -3,
                      backgroundColor: 'red',
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      paddingVertical: 1,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                      {cartCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          }

          return null;
        },
        tabBarLabel:
          route.name === 'Home'
            ? 'Home'
            : route.name === 'Favorites'
            ? 'Favorites'
            : route.name === 'Cart'
            ? 'Cart'
            : 'Products',
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ unmountOnBlur: false }}
      />
      <Tab.Screen
        name="Products"
        component={ProductListing}
        options={{ unmountOnBlur: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarBadge: favCount > 0 ? favCount : null,
        }}
      />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
