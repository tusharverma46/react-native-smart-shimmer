# react-native-smart-shimmer

Smart, auto-inferring shimmer skeleton loaders for React Native.

Wrap your content in `<SmartSkeleton>` and it renders an animated shimmer
placeholder while `isLoading` is `true` — inferring the placeholder shape from
your child's style, or from an explicit layout you provide.

## Installation

```sh
npm install react-native-smart-shimmer
# or
yarn add react-native-smart-shimmer
```

`react-native-linear-gradient` is installed automatically as a dependency.
Because it contains native code, iOS users need to run `pod install` once:

```sh
cd ios && pod install
```

## Usage

Wrap your app (or screen) once with `SkeletonProvider` — it drives a single
shared shimmer animation and holds the theme:

```tsx
import {
  SkeletonProvider,
  SmartSkeleton,
} from 'react-native-smart-shimmer';

function Screen({ loading, post }) {
  return (
    <SkeletonProvider theme={{ backgroundColor: '#E1E9EE', highlightColor: '#F2F8FC' }}>
      <SmartSkeleton isLoading={loading}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{post?.title}</Text>
      </SmartSkeleton>

      <SmartSkeleton isLoading={loading}>
        <Text style={{ marginTop: 10 }}>{post?.body}</Text>
      </SmartSkeleton>
    </SkeletonProvider>
  );
}
```

### Explicit layout (optional escape hatch)

Usually you don't need this — `SmartSkeleton` infers the shape from your
children automatically. If you want full control, pass a `layout` array of
plain `SkeletonProps` objects:

```tsx
import { SmartSkeleton } from 'react-native-smart-shimmer';

<SmartSkeleton
  isLoading={loading}
  layout={[
    { width: 60, height: 60, borderRadius: 30 }, // avatar
    { height: 14, marginBottom: 8 },             // text line
    { height: 14, width: '60%' },                // shorter line
    { height: 150 },                             // card
  ]}
>
  <MyRealContent />
</SmartSkeleton>
```

## API

### `<SkeletonProvider theme?>`

| Prop  | Type            | Description                                    |
| ----- | --------------- | ---------------------------------------------- |
| theme | `SkeletonTheme` | `{ backgroundColor?, highlightColor? }` colors |

### `<SmartSkeleton isLoading children layout?>`

| Prop      | Type              | Description                                                    |
| --------- | ----------------- | ------------------------------------------------------------- |
| isLoading | `boolean`         | When `true`, renders skeletons; otherwise renders `children`. |
| children  | `React.ReactNode` | Real content, also used to infer the skeleton shape.          |
| layout    | `SkeletonProps[]` | Optional explicit blocks. Overrides inference from children.  |

## License

MIT
