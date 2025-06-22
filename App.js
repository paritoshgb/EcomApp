import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
import { useColorScheme } from 'react-native';

const App = () => {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
