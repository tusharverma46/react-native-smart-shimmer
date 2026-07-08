import type { DimensionValue } from "react-native";

export type SkeletonProps = {
  width?: DimensionValue | number;
  height?: DimensionValue | number;
  marginBottom?: number;
  borderRadius?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
  margin?: number;
};


export type SkeletonTheme = {
    backgroundColor?: string;
    highlightColor?: string;
  };