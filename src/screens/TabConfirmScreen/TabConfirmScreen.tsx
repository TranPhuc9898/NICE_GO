// import React, {useState, useEffect, useMemo} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   RefreshControl,
// } from 'react-native';
// import {useTranslation} from 'react-i18next';
// import {useNavigation} from '@react-navigation/native';
// import Animated from 'react-native-reanimated';
// import useOrderFilter from '@/api/OrderFilter';
// import {useAppSelector} from '@/hooks/UseAppSelector/useAppSelector';
// import {handleChangePrice} from '@/constants';
// import useTabBarAnimation from '@/navigation/tabBarNavigation/useTabBarAnimation';
// import {OrderDetailResponse} from '@/api/OrderDetail';
// import CustomSkeleton from '@/components/CustomSkeleton';
// import callApi from '@/constants/callApi';
// import {useQueryClient} from '@tanstack/react-query';

// const TabConfirmScreen = () => {
//   const queryClient = useQueryClient();
//   const {t} = useTranslation();
//   const navigation = useNavigation();

//   const [pressedItemId, setPressedItemId] = useState<string | null>(null);
//   const {scrollHandler} = useTabBarAnimation();

//   const originCoords = useAppSelector(state => state.coordinate.originCoords);
//   const destinationCoords = useAppSelector(
//     state => state.coordinate.destinationCoords,
//   );
//   const coordinatesLoading = useAppSelector(
//     state => state.coordinate.isLoading,
//   );

//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const requestBody = useMemo(
//     () => ({
//       origin: {
//         lat: originCoords?.latitude || '',
//         lng: originCoords?.longitude || '',
//       },
//       destination: {
//         lat: destinationCoords?.latitude || '',
//         lng: destinationCoords?.longitude || '',
//       },
//       range: 50,
//     }),
//     [originCoords, destinationCoords],
//   );

//   const [minLoading, setMinLoading] = useState(true);
//   useEffect(() => {
//     setMinLoading(true);
//     const timer = setTimeout(() => {
//       setMinLoading(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, [requestBody]);

//   const userType = useAppSelector(state => state.user.role_index);

//   const isAppReady = useMemo(() => {
//     return (
//       originCoords?.latitude &&
//       originCoords?.longitude &&
//       destinationCoords?.latitude &&
//       destinationCoords?.longitude
//     );
//   }, [originCoords, destinationCoords]);

//   const {
//     data: filterResponse,
//     isLoading,
//     isFetching,
//     refetch,
//   } = useOrderFilter(userType, requestBody, true);

//   const filterData = filterResponse?.data || [];

//   const handlePressItem = async (itemId: number) => {
//     if (isLoading || isFetching) return;
//     try {
//       const data = await queryClient.fetchQuery({
//         queryKey: ['OrderDetail_API', {id: itemId}],
//         queryFn: async () => {
//           const response = await callApi.get<OrderDetailResponse>(
//             `/order/${itemId}`,
//           );
//           return response.data;
//         },
//       });
//       navigation.navigate('DetailTabScreen', {item: data});
//     } catch (error) {
//       console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
//     }
//   };

//   const onRefresh = async () => {
//     setIsRefreshing(true);
//     await refetch();
//     await new Promise(res => setTimeout(res, 1000));
//     setIsRefreshing(false);
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: '#fff'}}>
//       <Animated.ScrollView
//         onScroll={scrollHandler}
//         scrollEventThrottle={16}
//         contentContainerStyle={{flexGrow: 1}}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
//         }>
//         {isLoading ||
//         isFetching ||
//         (minLoading && isAppReady) ||
//         coordinatesLoading ? (
//           <CustomSkeleton count={3} />
//         ) : (
//           filterData.map(item => {
//             const isItemPressed = pressedItemId === item.id.toString();
//             return (
//               <View style={{marginTop: 2, paddingHorizontal: 15}} key={item.id}>
//                 <TouchableOpacity
//                   activeOpacity={1}
//                   onPressIn={() => setPressedItemId(item.id.toString())}
//                   onPressOut={() => setPressedItemId(null)}
//                   onPress={() => handlePressItem(item.id)}
//                   style={{
//                     backgroundColor: isItemPressed ? '#346efb' : '#efefef',
//                     marginVertical: 15,
//                     padding: 15,
//                     borderRadius: 12,
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                   }}>
//                   <View
//                     style={{
//                       width: 60,
//                       height: 60,
//                       borderRadius: 12,
//                       backgroundColor: '#fff',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginRight: 5,
//                     }}>
//                     <Image source={require('@/assets/image/car.png')} />
//                   </View>
//                   <View style={{flex: 1}}>
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                       }}>
//                       <View style={{flex: 1, marginRight: 10}}>
//                         <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
//                           {t('HOMESCREEN.TRIP')}{' '}
//                           <Text
//                             style={{
//                               fontSize: 12,
//                               fontWeight: 'bold',
//                               flexShrink: 1,
//                             }}
//                             numberOfLines={1}
//                             ellipsizeMode="tail">
//                             {item.origin} → {item.destination}
//                           </Text>
//                         </Text>
//                       </View>
//                       <View style={{flexDirection: 'row', flexShrink: 0}}>
//                         <Image
//                           source={require('@/assets/image/driver.png')}
//                           style={{width: 15, height: 15, marginRight: 5}}
//                         />
//                         <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
//                           {item.car_type}
//                         </Text>
//                       </View>
//                     </View>
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         marginTop: 8,
//                       }}>
//                       <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
//                         {t('HOMESCREEN.TRIP_PRICE')}
//                       </Text>
//                       <Text
//                         style={{
//                           color: isItemPressed ? '#fff' : '#000',
//                           fontWeight: 'bold',
//                         }}>
//                         {handleChangePrice(item.price)}K
//                       </Text>
//                     </View>
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         marginTop: 5,
//                       }}>
//                       <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
//                         {t('HOMESCREEN.TRIP_TYPE')}
//                       </Text>
//                       <Text
//                         style={{
//                           fontSize: 12,
//                           fontWeight: 'bold',
//                           color: isItemPressed ? '#fff' : '#000',
//                         }}>
//                         {item.trip_type}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             );
//           })
//         )}
//       </Animated.ScrollView>
//     </View>
//   );
// };

// export default TabConfirmScreen;
import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import useOrderFilter from '@/api/OrderFilter';
import {useAppSelector} from '@/hooks/UseAppSelector/useAppSelector';
import {handleChangePrice} from '@/constants';
import useTabBarAnimation from '@/navigation/tabBarNavigation/useTabBarAnimation';
import {OrderDetailResponse} from '@/api/OrderDetail';
import CustomSkeleton from '@/components/CustomSkeleton';
import callApi from '@/constants/callApi';
import {useQueryClient} from '@tanstack/react-query';

const TabConfirmScreen = () => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();
  const navigation = useNavigation<any>();

  const [pressedItemId, setPressedItemId] = useState<string | null>(null);
  const {scrollHandler} = useTabBarAnimation();

  // Lấy toạ độ từ Redux
  const originCoords = useAppSelector(state => state.coordinate.originCoords);
  const destinationCoords = useAppSelector(
    state => state.coordinate.destinationCoords,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Xây dựng body => Dù rỗng hay không thì vẫn truyền, tuỳ backend
  const requestBody = useMemo(
    () => ({
      origin: {
        lat: originCoords?.latitude || '',
        lng: originCoords?.longitude || '',
      },
      destination: {
        lat: destinationCoords?.latitude || '',
        lng: destinationCoords?.longitude || '',
      },
      range: 50,
    }),
    [originCoords, destinationCoords],
  );

  // minLoading để hiển thị skeleton tối thiểu 1 giây
  const [minLoading, setMinLoading] = useState(true);
  useEffect(() => {
    setMinLoading(true);
    const timer = setTimeout(() => {
      setMinLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [requestBody]);

  const userType = useAppSelector(state => state.user.role_index);

  const {
    data: filterResponse,
    isLoading, // Đang fetch
    isFetching, // Đang fetch
    isError,
    refetch,
  } = useOrderFilter(
    userType,
    requestBody,
    true /* enabled: true hoặc tuỳ điều kiện */,
  );

  const filterData = filterResponse?.data || [];

  const handlePressItem = async (itemId: number) => {
    if (isLoading) return;
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ['OrderDetail_API', {id: itemId}],
        queryFn: async () => {
          const response = await callApi.get<OrderDetailResponse>(
            `/order/${itemId}`,
          );
          return response.data;
        },
      });
      navigation.navigate('DetailTabScreen', {item: data});
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    // ép 1s cho dễ nhìn
    await new Promise(res => setTimeout(res, 1000));
    setIsRefreshing(false);
  };

  const isLoadingSkeleton = isLoading || minLoading || isRefreshing;

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        {isLoadingSkeleton ? (
          <CustomSkeleton count={3} />
        ) : (
          filterData.map(item => {
            const isItemPressed = pressedItemId === item.id.toString();
            return (
              <View style={{marginTop: 2, paddingHorizontal: 15}} key={item.id}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPressIn={() => setPressedItemId(item.id.toString())}
                  onPressOut={() => setPressedItemId(null)}
                  onPress={() => handlePressItem(item.id)}
                  style={{
                    backgroundColor: isItemPressed ? '#346efb' : '#efefef',
                    marginVertical: 15,
                    padding: 15,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      backgroundColor: '#fff',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    <Image source={require('@/assets/image/car.png')} />
                  </View>
                  <View style={{flex: 1}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View style={{flex: 1, marginRight: 10}}>
                        <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
                          {t('HOMESCREEN.TRIP')}{' '}
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: 'bold',
                              flexShrink: 1,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {item.origin} → {item.destination}
                          </Text>
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row', flexShrink: 0}}>
                        <Image
                          source={require('@/assets/image/driver.png')}
                          style={{width: 15, height: 15, marginRight: 5}}
                        />
                        <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
                          {item.car_type}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 8,
                      }}>
                      <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
                        {t('HOMESCREEN.TRIP_PRICE')}
                      </Text>
                      <Text
                        style={{
                          color: isItemPressed ? '#fff' : '#000',
                          fontWeight: 'bold',
                        }}>
                        {handleChangePrice(item.price)}K
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5,
                      }}>
                      <Text style={{color: isItemPressed ? '#fff' : '#000'}}>
                        {t('HOMESCREEN.TRIP_TYPE')}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: isItemPressed ? '#fff' : '#000',
                        }}>
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
          })
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default TabConfirmScreen;
