/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import {Loading} from '../components/no_data_found';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../components/app_header';

const NotificationPage = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [getNotifiy, setNotification] = useState([]);

  const url = BaseUrl(ApiConstants.getNotifications);

  const checking = useCallback(async () => {
    setLoading(true);
    var token = await AsyncStorage.getItem('token');
    await axios
      .post(url, {
        token: token,
        id: 2,
      })
      .then(response => {
        if (response.status === 200) {
          setNotification(response.data?.data);
          setLoading(false);
        }
      });
  });

  useEffect(() => {
    checking();
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader text={'Notification'} navigate={navigation} />
      <ScrollView>
        {getNotifiy.slice(0, 50).map((data, index) => (
          <View key={index} style={styles.notificationContainer}>
            <View style={styles.notificationIcon}>
              <View style={styles.imageContainer}>
                <Ionicons name={'person'} color={ColorConstants.primaryWhite} />
              </View>
              <Text style={styles.notificationText}>
                {data.user_notification}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
  },
  notificationContainer: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'row',
  },
  imageContainer: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
    borderRadius: 100,
    backgroundColor: ColorConstants.textHintColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    flex: 1,
    color: ColorConstants.primaryBlack,
  },
});

export default NotificationPage;
