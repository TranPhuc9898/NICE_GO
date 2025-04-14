import * as React from 'react';
import {Image, Text, View} from 'react-native';

interface Props {
  name?: any;
  isCurrent?: boolean;
  iconName?: React.ReactNode | null;
}

export const BottomMenuItem: React.FC<Props> = ({
  name,
  isCurrent,
  iconName,
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {iconName}
        {/* <Text
          style={{
            color: isCurrent ? '#1154FF' : '#50555C',
            textAlign: 'center',
          }}>
          {name.toString()}
        </Text> */}
      </View>
    </View>
  );
};
