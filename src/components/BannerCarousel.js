import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';

const { width } = Dimensions.get('window');

const BannerCarousel = ({ images, type }) => {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

  const isValidImages = Array.isArray(images) && images.length > 0;

  useEffect(() => {
    if (!isValidImages) return;

    const interval = setInterval(() => {
      const nextIndex = (index + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [index, images]);

  if (!isValidImages) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No banners available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={[styles.image, { height: type == 'ad' ? 100 : 200 }]}
            resizeMode="contain"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
  },
  fallbackContainer: {
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  fallbackText: {
    fontSize: 16,
    color: '#999',
  },
  image: {
    width: width - 35,
    height: 150,
    borderRadius: 30,
    marginHorizontal: 2,
  },
});

export default BannerCarousel;
