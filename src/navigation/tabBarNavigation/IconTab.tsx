import React from 'react';
import {Image, StyleSheet, Text} from 'react-native';

// Định nghĩa kiểu trả về của home_icon
const home_icon = (
  icon?: string,
  isCurrent?: boolean,
): React.ReactNode | null => {
  // Định nghĩa đối tượng icons với các yêu cầu tĩnh
  const icons = {
    Home: require('@icons/home-button.png'),
    Settings: require('@icons/gear.png'),
    Profile: require('@icons/user.png'),
  };
  // Kiểm tra xem icon có tồn tại trong đối tượng icons không và trả về Image nếu có
  if (icon && icons[icon as keyof typeof icons]) {
    return (
      <Image
        source={icons[icon as keyof typeof icons]}
        style={[{tintColor: isCurrent ? '#1154FF' : '#50555C'}, styles.icon]}
      />
    );
  }
  // Trả về null hoặc một giá trị mặc định nếu không có icon khớp
  return null;
};
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default home_icon;
