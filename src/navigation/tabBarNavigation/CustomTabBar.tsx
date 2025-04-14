import * as React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {BottomMenuItem} from './BottomMenuItem';
import home_icon from './IconTab';

const CustomTabBar = ({state, descriptors, navigation}: any) => {
  const translateY = useSelector((state: any) => state.tabBar.translateY);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: withTiming(translateY, {duration: 300})}],
      position: 'absolute',
      bottom: 20, // Tăng khoảng cách từ dưới lên để tạo "nổi"
      left: 20, // Tăng khoảng cách từ trái
      right: 20, // Tăng khoảng cách từ phải
      height: 70, // Tăng chiều cao của TabBar
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Màu nền trong suốt với độ mờ
      borderRadius: 20, // Bo tròn ở hai bên
      flexDirection: 'row', // Sắp xếp các nút menu theo hàng ngang
      alignItems: 'center', // Căn giữa các nút theo chiều dọc
      justifyContent: 'space-around', // Phân bổ đều khoảng cách giữa các nút
      // Thêm bóng nếu cần
      shadowColor: '#000',
      shadowOffset: {
        width: 5,
        height: 3,
      },
      shadowRadius: 4,
      borderWidth: 0.3, // <- thêm đường viền nhạt
      borderColor: '#ccc', // <- màu viền
      elevation: 5,
    } as ViewStyle;
  });

  return (
    <Animated.View style={[animatedStyle]}>
      {state.routes.map((route: any, index: any) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the navigation state is merged
            // and not replaced, preserving the existing state in the stack.
            navigation.navigate({name: route.name, merge: true});
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress}>
            <BottomMenuItem
              // name={label.toString()}
              isCurrent={isFocused}
              iconName={home_icon(label.toString(), isFocused)}
            />
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

export default CustomTabBar;
