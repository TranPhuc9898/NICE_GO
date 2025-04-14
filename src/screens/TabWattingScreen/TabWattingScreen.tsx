// import {FlatList, StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {useAppSelector} from '@/hooks/UseAppSelector/useAppSelector';
// import CardOrder from '@/components/CardOrder';

// import _ from 'lodash';
// import {ICardOrder} from '@/utils/types';
// import {useNavigation} from '@react-navigation/native';

// interface ITabWattingScreen {}

// const TabWattingScreen: React.FC<ITabWattingScreen> = () => {
//   //NAVIGATION
//   const navigation = useNavigation();
//   // GET DATA FROM REDUX
//   const dataOrderList: ICardOrder[] =
//     useAppSelector(state => state.orderList.data) || [];
//   const dataOrderListWaitting: ICardOrder[] = _.filter(dataOrderList, {
//     status: 'waiting',
//   });

//   // keyExtractor
//   const keyExtractor = (item: any, index: number) => {
//     return item?.id?.toString() || index.toString();
//   };

//   const onPressItem = (item: any) => {
//     navigation.navigate('DetailTabScreen', {id: item.id});
//   };
//   return (
//     <View style={{flex: 1, backgroundColor: 'white'}}>
//       <FlatList
//         data={dataOrderListWaitting}
//         renderItem={({item, index}) => {
//           console.log('🚀 ~ item:', item);
//           console.log('Item:', item); // Log item ra console
//           return (
//             <CardOrder
//               data={item}
//               onPress={() => {
//                 console.log('Pressed Item:', item); // Log khi nhấn vào item
//                 onPressItem(item);
//               }}
//             />
//           );
//         }}
//         keyExtractor={keyExtractor}
//         contentContainerStyle={{paddingHorizontal: 16, paddingVertical: 12}}
//       />
//     </View>
//   );
// };

// export default TabWattingScreen;

// const styles = StyleSheet.create({});

import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {handleChangePrice} from '@/constants';
import useTabBarAnimation from '@/navigation/tabBarNavigation/useTabBarAnimation';
import Animated from 'react-native-reanimated';
import useOrderMeAcceptApi from '@/api/OrderMeAccpet';
import {styles} from './styles';

// ====== IMPORT THÊM CÁC THƯ VIỆN CẦN THIẾT CHO HÀM handlePressItem ======
import {useQueryClient} from '@tanstack/react-query';
import callApi from '@/constants/callApi';
import {OrderDetailResponse} from '@/api/OrderDetail';

const TabWattingScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);
  const {scrollHandler} = useTabBarAnimation();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // ====== QUERY CLIENT DÙNG CHO handlePressItem ======
  const queryClient = useQueryClient();

  const {
    data: dataOrder,
    isLoading: isLoadingOrder,
    refetch,
  } = useOrderMeAcceptApi('accepted');
  console.log('🚀 ~ TabWattingScreen ~ dataOrder:', dataOrder);

  // Nếu vẫn cần refetch mỗi lần vào lại screen:
  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchData = async () => {
  //       try {
  //         setIsManualRefreshing(true);
  //         await refetch();
  //       } finally {
  //         setIsManualRefreshing(false);
  //       }
  //     };
  //     fetchData();
  //   }, [refetch]),
  // );

  // ====== COPY LOGIC handlePressItem giống TabConfirmScreen ======
  const handlePressItem = async (itemId: string) => {
    // Kiểm tra nếu đang loading thì không cho bấm
    if (isLoadingOrder || isManualRefreshing) return;

    try {
      // Gọi API lấy chi tiết đơn hàng
      const data = await queryClient.fetchQuery({
        queryKey: ['OrderDetail_API', {id: itemId}],
        queryFn: async () => {
          const response = await callApi.get<OrderDetailResponse>(
            `/order/${itemId}`,
          );
          return response.data;
        },
      });
      // Khi lấy thành công, chuyển sang màn DetailMyBooking kèm data
      navigation.navigate('DetailMyBooking', {item: data});
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    }
  };

  const getDynamicStyle = (
    isPressed: boolean,
  ): {
    card: StyleProp<ViewStyle>;
    text: StyleProp<TextStyle>;
    tripType: StyleProp<TextStyle>;
  } => ({
    card: {
      backgroundColor: isPressed ? '#346efb' : '#efefef',
    },
    text: {
      color: isPressed ? '#fff' : '#000',
    },
    tripType: {
      color: isPressed ? '#fff' : '#000',
    },
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {dataOrder?.data?.map(item => {
        const isItemPressed = pressedItemId === item.id;
        const dynamicStyles = getDynamicStyle(isItemPressed);

        return (
          <View key={item.id} style={styles.itemContainer}>
            {(isLoadingOrder || isManualRefreshing) && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPressIn={() => setPressedItemId(item.id)}
              onPressOut={() => setPressedItemId(null)}
              // ====== THAY VÌ ĐI THẲNG navigation, TA GỌI handlePressItem ======
              onPress={() => handlePressItem(item.id)}
              style={[styles.itemCard, dynamicStyles.card]}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/image/car.png')}
                  style={{width: 40, height: 40}}
                />
              </View>

              <View style={styles.contentWrapper}>
                {/* Header Row */}
                <View style={styles.rowSpaceBetween}>
                  <View style={[styles.flex1, styles.marginRight10]}>
                    <Text style={dynamicStyles.text}>
                      {t('HOMESCREEN.TRIP')}
                      <Text
                        style={[styles.tripText, dynamicStyles.text]}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {' '}
                        {item.origin} → {item.destination}
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.carTypeWrapper}>
                    <Image
                      source={require('../../assets/image/driver.png')}
                      style={styles.carTypeImage}
                    />
                    <Text style={dynamicStyles.text}>{item.car_type}</Text>
                  </View>
                </View>

                {/* Price Row */}
                <View style={[styles.rowSpaceBetween, styles.marginTop5]}>
                  <Text style={dynamicStyles.text}>
                    {t('HOMESCREEN.TRIP_PRICE')}
                  </Text>
                  <Text style={[styles.priceText, dynamicStyles.text]}>
                    {handleChangePrice(item.price)}K
                  </Text>
                </View>

                {/* Trip Type Row */}
                <View style={[styles.rowSpaceBetween, styles.marginTop5]}>
                  <Text style={dynamicStyles.text}>
                    {t('HOMESCREEN.TRIP_TYPE')}
                  </Text>
                  <Text style={[styles.tripTypeText, dynamicStyles.tripType]}>
                    {item.trip_type}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 5,
                  }}>
                  <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
                    {t('HOMESCREEN.TRIP_CREATED')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: isItemPressed ? '#fff' : '#000',
                    }}>
                    {item?.updated_at}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </Animated.ScrollView>
  );
};

export default TabWattingScreen;
