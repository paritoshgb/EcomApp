import { useColorScheme } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useAppTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return {
    isDarkMode,
    isConnected,
    colors: {
      background: isDarkMode ? '#111' : '#fff',
      text: isDarkMode ? '#fff' : '#000',
      subText: isDarkMode ? '#000' : '#555',
      card: isDarkMode ? '#1c1c1c' : '#f2f2f2',
    },
  };
};
