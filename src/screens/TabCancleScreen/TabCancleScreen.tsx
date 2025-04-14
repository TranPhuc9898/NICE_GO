import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {handleChangePrice} from '@/constants';
import useTabBarAnimation from '@/navigation/tabBarNavigation/useTabBarAnimation';
import Animated from 'react-native-reanimated';
import useOrderMeApi from '@/api/OrderMe';
import CustomSkeleton from '@/components/CustomSkeleton';
import {useQueryClient} from '@tanstack/react-query';
import callApi from '@/constants/callApi';
import {OrderDetailResponse} from '@/api/OrderDetail';

const TabCancleScreen = ({route}: {route: any}) => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {scrollHandler} = useTabBarAnimation();
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const {
    data: dataOrder,
    isLoading: isLoadingOrder,
    refetch,
  } = useOrderMeApi(true);

  const handlePressItem = async (itemId: any) => {
    if (localLoading) return;
    try {
      setLocalLoading(true);
      const data = await queryClient.fetchQuery({
        queryKey: ['OrderDetail_API', {id: itemId}],
        queryFn: async () => {
          const response = await callApi.get<OrderDetailResponse>(
            `/order/${itemId}`,
          );
          return response.data;
        },
      });
      navigation.navigate('DetailMyBooking', {item: data});
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={{backgroundColor: '#fff'}}
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }>
      {isLoadingOrder || isRefreshing ? (
        <CustomSkeleton count={4} />
      ) : (
        dataOrder?.data?.map(item => {
          const isItemPressed = pressedItemId === item.id.toString();
          return (
            <View key={item.id} style={{marginTop: 2, paddingHorizontal: 15}}>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => setPressedItemId(item.id.toString())}
                onPressOut={() => setPressedItemId(null)}
                onPress={() => handlePressItem(item.id)}
                style={{
                  backgroundColor: isItemPressed ? '#346efb' : '#efefef',
                  marginVertical: 10,
                  padding: 15,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {/* Phần UI giữ nguyên */}
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
                  <Image source={require('../../assets/image/car.png')} />
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
                        {t('HOMESCREEN.TRIP') + ' '}
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
                        source={require('../../assets/image/driver.png')}
                        style={{width: 15, height: 15, marginRight: 5}}
                      />
                      <Text
                        style={{
                          color: isItemPressed ? '#fff' : '#000',
                          fontWeight: 'bold',
                        }}>
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
  );
};

export default TabCancleScreen;
