import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { SmartSkeleton, SkeletonProvider } from '../src';

type Post = {
  title: string;
  body: string;
};

export const Example = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Post | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const json = await res.json();
        setTimeout(() => {
          setData(json);
          setLoading(false);
        }, 3000);
      } catch (err) {
        console.log('API Error:', err);
        setLoading(false);
      }
    };

  return (
    <View style={{ marginTop: 100 }}>
      <SkeletonProvider
        theme={{ backgroundColor: 'grey', highlightColor: 'lightgrey' }}
      >
        <View>
          <SmartSkeleton isLoading={loading}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginHorizontal: 20 }}>
              {data?.title}
            </Text>
          </SmartSkeleton>
          <SmartSkeleton isLoading={loading}>
            <Text style={{ marginTop: 10,marginHorizontal: 20 }}>{data?.body}</Text>
          </SmartSkeleton>
          <SmartSkeleton isLoading={loading}>
            <Text style={{ marginTop: 10 }}>{data?.body}</Text>
          </SmartSkeleton>
          <SmartSkeleton isLoading={loading}>
            <Text style={{ marginTop: 10 }}>{data?.body}</Text>
          </SmartSkeleton>
          {/* Explicit `layout`: define the skeleton shape yourself instead of
              inferring it. Here: a circular avatar block + a short caption line. */}
          <SmartSkeleton
            isLoading={loading}
            layout={[
              { width: 200, height: 200, borderRadius: 100, marginTop: 10 },
              { width: '50%', height: 14, borderRadius: 4, marginTop: 8 },
            ]}
          >
            <Image style={{ height: 200, width: 200, borderRadius: 100, resizeMode:'stretch' }} source={{ uri: 'https://image.tmdb.org/t/p/w342/in1R2dDc421JxsoRWaIIAqVI2KE.jpg'}} />
          </SmartSkeleton>
          <SmartSkeleton isLoading={loading}>
            <Text style={{ marginTop: 10 }}>
            This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
             {'\n'}This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
             {'\n'}This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
             {'\n'}This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
             {'\n'}This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
             {'\n'}This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
             {'\n'}This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
             {'\n'}This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
             {'\n'}This is a constant paragraph that will always be added to the API response. You can display it anywhere in your component.
            </Text>
          </SmartSkeleton>
        </View>
      </SkeletonProvider>
    </View>
  );
};
