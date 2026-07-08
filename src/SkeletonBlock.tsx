import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSkeleton } from './useShimmer';
import { SkeletonProps } from './types';

export const SkeletonBlock = (props: SkeletonProps) => {
  const { ...layoutStyle } = props;

  const { translateX, theme } = useSkeleton();

  return (
    <View
      style={[
        styles.container,
        layoutStyle,
        {
          backgroundColor: theme.backgroundColor,
        },
      ]}
    >
      <Animated.View
        style={[styles.shimmerWrapper, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={[
            theme.backgroundColor,
            theme.highlightColor,
            theme.backgroundColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmerWrapper: {
    width: '200%',
    height: '100%',
  },
  shimmer: {
    flex: 1,
  },
});
