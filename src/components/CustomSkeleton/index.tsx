import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

// Component Shimmer nhận vào sharedValue từ CustomSkeleton
const Shimmer = React.memo(
  ({sharedValue}: {sharedValue: Animated.SharedValue<number>}) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{translateX: sharedValue.value}],
    }));
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          animatedStyle,
          {backgroundColor: 'rgba(255,255,255,0.5)'},
        ]}
      />
    );
  },
);

const CustomSkeleton = React.memo(({count = 3}: {count?: number}) => {
  // Tạo 1 shared value chung cho toàn bộ animation
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(withTiming(200, {duration: 1000}), -1, false);
  }, [translateX]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {Array.from({length: count}).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <Shimmer sharedValue={translateX} />
          </View>
          <View style={styles.content}>
            <View style={styles.lineShort}>
              <Shimmer sharedValue={translateX} />
            </View>
            <View style={styles.lineLong}>
              <Shimmer sharedValue={translateX} />
            </View>
            <View style={styles.lineMedium}>
              <Shimmer sharedValue={translateX} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#ddd',
    marginRight: 10,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  lineShort: {
    width: '50%',
    height: 10,
    backgroundColor: '#ddd',
    marginBottom: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  lineLong: {
    width: '80%',
    height: 10,
    backgroundColor: '#ddd',
    marginBottom: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  lineMedium: {
    width: '60%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default CustomSkeleton;
