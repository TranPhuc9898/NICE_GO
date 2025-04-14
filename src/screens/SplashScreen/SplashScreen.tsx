import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/image/car.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish} // Chỉ gọi khi hoạt ảnh kết thúc
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
