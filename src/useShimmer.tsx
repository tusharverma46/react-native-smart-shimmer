import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { SkeletonTheme } from './types';

type SkeletonContextValue = {
  translateX: Animated.AnimatedInterpolation<number> | Animated.Value;
  theme: Required<SkeletonTheme>;
};

const defaultTheme: Required<SkeletonTheme> = {
  backgroundColor: '#E1E9EE',
  highlightColor: '#F2F8FC',
};

// Fallback so <SmartSkeleton /> renders a static (non-shimmering) block
// instead of crashing when used without a <SkeletonProvider />.
const SkeletonContext = createContext<SkeletonContextValue>({
  translateX: new Animated.Value(0),
  theme: defaultTheme,
});

export const SkeletonProvider = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: SkeletonTheme;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const mergedTheme: Required<SkeletonTheme> = { ...defaultTheme, ...theme };

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // better control than %
  });

  return (
    <SkeletonContext.Provider value={{ translateX, theme: mergedTheme }}>
      {children}
    </SkeletonContext.Provider>
  );
};

export const useSkeleton = (): SkeletonContextValue => useContext(SkeletonContext);

export const useShimmer = useSkeleton;
