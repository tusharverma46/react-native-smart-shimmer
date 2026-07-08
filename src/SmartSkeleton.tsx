import React from 'react';
import {DimensionValue, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import { SkeletonBlock } from './SkeletonBlock';
import { SkeletonProps } from './types';

type SmartSkeletonProps = {
  children: React.ReactNode;
  isLoading: boolean;
  layout?: SkeletonProps[];
};

const DEFAULT_LINE_HEIGHT = 14;
const DEFAULT_BORDER_RADIUS = 4;
const LINE_GAP = 6;
const LAST_LINE_WIDTH: DimensionValue = '60%';
const FULL_WIDTH: DimensionValue = '100%';

export const SmartSkeleton = (props: SmartSkeletonProps) => {
  const { children, isLoading, layout } = props;
  if (!isLoading) {
    return <>{children}</>;
  }

  const normalizedLayout = layout
    ? Array.isArray(layout)
      ? layout
      : [layout]
    : [];
  const resolvedLayout =
    normalizedLayout.length > 0 ? normalizedLayout : inferBlocks(children);

  return (
    <View>
      {resolvedLayout.map((item, index) => (
        <SkeletonBlock key={index} {...item} />
      ))}
    </View>
  );
};

// Walk every valid child and turn each into one or more skeleton blocks.
const inferBlocks = (children: React.ReactNode): SkeletonProps[] => {
  const blocks: SkeletonProps[] = [];

  React.Children.toArray(children).forEach((child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    blocks.push(...blocksForElement(child));
  });

  return blocks.length > 0
    ? blocks
    : [{ height: DEFAULT_LINE_HEIGHT, width: FULL_WIDTH, borderRadius: DEFAULT_BORDER_RADIUS }];
};

const blocksForElement = (child: React.ReactElement): SkeletonProps[] => {
  const childProps = child.props as {
    style?: unknown;
    children?: React.ReactNode;
    numberOfLines?: number;
  };
  const style = (StyleSheet.flatten(childProps.style) ?? {}) as ViewStyle &
    TextStyle;
  const margins = extractMargins(style);
  const borderRadius = toNumber(style.borderRadius) ?? DEFAULT_BORDER_RADIUS;

  // Text: estimate line height, expand into multiple lines when we can tell.
  if (child.type === Text) {
    const lineHeight =
      toNumber(style.lineHeight) ??
      (toNumber(style.fontSize)
        ? Math.round(toNumber(style.fontSize)! * 1.2)
        : DEFAULT_LINE_HEIGHT);
    const height = toNumber(style.height) ?? lineHeight;
    const width = (style.width as DimensionValue) ?? FULL_WIDTH;
    const lines = countTextLines(childProps);

    if (lines <= 1) {
      return [{ ...margins, borderRadius, height, width }];
    }

    return Array.from({ length: lines }, (_, i) => ({
      borderRadius,
      height,
      width: i === lines - 1 ? LAST_LINE_WIDTH : width,
      // Horizontal margins repeat on every line; vertical margins only bookend.
      marginLeft: margins.marginLeft,
      marginRight: margins.marginRight,
      marginHorizontal: margins.marginHorizontal,
      marginTop: i === 0 ? margins.marginTop : undefined,
      marginBottom: i === lines - 1 ? margins.marginBottom : LINE_GAP,
    }));
  }

  // Explicitly sized element (Image, sized View, etc.) — one block, keep dims.
  if (style.height != null || style.width != null) {
    return [
      {
        ...margins,
        borderRadius,
        width: style.width as DimensionValue,
        height: (style.height as DimensionValue) ?? DEFAULT_LINE_HEIGHT,
      },
    ];
  }

  // Unsized container with children — recurse into it.
  if (childProps.children != null) {
    const inner = inferBlocks(childProps.children);
    if (inner.length > 0) {
      return inner;
    }
  }

  return [{ ...margins, borderRadius, height: DEFAULT_LINE_HEIGHT, width: FULL_WIDTH }];
};

// Best-effort line count: explicit numberOfLines wins, else count "\n" in the text.
const countTextLines = (childProps: {
  children?: React.ReactNode;
  numberOfLines?: number;
}): number => {
  if (
    typeof childProps.numberOfLines === 'number' &&
    childProps.numberOfLines > 0
  ) {
    return childProps.numberOfLines;
  }

  const text = flattenText(childProps.children);
  if (text) {
    const lines = text.split('\n').filter((line) => line.trim().length > 0);
    return Math.max(1, lines.length);
  }

  return 1;
};

const flattenText = (node: React.ReactNode): string =>
  React.Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }
      if (React.isValidElement(child)) {
        return flattenText((child.props as { children?: React.ReactNode }).children);
      }
      return '';
    })
    .join('');

const extractMargins = (style: ViewStyle & TextStyle): SkeletonProps => ({
  marginBottom: toNumber(style.marginBottom),
  marginTop: toNumber(style.marginTop),
  marginLeft: toNumber(style.marginLeft),
  marginRight: toNumber(style.marginRight),
  marginHorizontal: toNumber(style.marginHorizontal),
  marginVertical: toNumber(style.marginVertical),
  margin: toNumber(style.margin),
});

const toNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;
