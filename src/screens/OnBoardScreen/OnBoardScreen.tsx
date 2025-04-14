// OnBoardingScreen
import React, {useRef, useState} from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome',
    description: 'Discover new features and improve your experience.',
    image: require('../../assets/a.png'),
  },
  {
    title: 'Easy to Use',
    description: 'Our app is user-friendly and easy to navigate.',
    image: require('../../assets/b.png'),
  },
  {
    title: 'Stay Connected',
    description: 'Keep up with the latest updates and news.',
    image: require('../../assets/c.png'),
  },
];

const OnBoardingScreen = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasViewedOnBoarding', 'true');
      navigation.navigate('Login'); // Chuyển tới màn hình đăng nhập
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.slideContainer}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={slides}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        loop={false}
        onSnapToItem={index => {
          setActiveIndex(index);
          if (index === slides.length - 1) {
            setTimeout(completeOnboarding, 500);
          }
        }}
      />
      <Pagination
        dotsLength={slides.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.activeDot}
        inactiveDotStyle={styles.inactiveDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slideContainer: {
    width: screenWidth,
    height: screenHeight,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  activeDot: {
    width: 15,
    height: 15,
    borderRadius: 7,
    backgroundColor: '#41D5FB',
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
  },
});

export default OnBoardingScreen;
