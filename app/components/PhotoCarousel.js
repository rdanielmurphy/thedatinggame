import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import { API_URL } from '../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getPhotoUri = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `${API_URL}${photo}`;
};

export default function PhotoCarousel({ photos, style }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }, []);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  if (!photos || photos.length === 0) {
    return (
      <View style={[styles.container, style, styles.placeholder]}>
        <Text style={styles.placeholderText}>👤</Text>
      </View>
    );
  }

  const containerWidth = style?.width || SCREEN_WIDTH;

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item}-${index}`}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <Image
            source={{ uri: getPhotoUri(item) }}
            style={[styles.image, { width: containerWidth }]}
          />
        )}
      />
      {photos.length > 1 && (
        <View style={styles.dots}>
          {photos.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
