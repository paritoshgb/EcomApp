import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const netinfo = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};
