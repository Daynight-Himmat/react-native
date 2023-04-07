/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import {Loading, NoData} from '../components/no_data_found';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NotificationPage = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [getNotifiy, setNotification] = useState([]);
  const [getDate, setDate] = useState([]);
  var result = [];

  const url = BaseUrl(ApiConstants.getNotifications);

  const checking = useCallback(async () => {
    setLoading(true);
    return await AsyncStorage.getItem('token').then(async asyncStorageRes => {
      setToken(asyncStorageRes);
      console.log(
        'this is the data',
        JSON.parse(JSON.stringify(asyncStorageRes)),
      );
      console.log('token', token);
      await axios
        .post(url, {
          token: asyncStorageRes,
          id: 2,
        })
        .then(response => {
          if (response.status === 200) {
            setNotification(response.data?.data);
            console.log(getNotifiy.slice(0, 1));
            setLoading(false);
          }
        });
    });
  });

  useEffect(() => {
    checking();
  }, []);

  return loading === false ? (
    <View style={styles.container}>
      <ScrollView>
        {getNotifiy.slice(0, 50).map((data, index) => (
          <View
            key={index}
            style={{
              padding: 10,
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: ColorConstants.primaryWhite,
                flexDirection: 'row',
              }}>
              <View style={styles.imageContainer}>
                <Ionicons name={'person'} color={ColorConstants.primaryWhite} />
              </View>
              <View style={{padding: 5}} />
              <Text
                style={{
                  flex:1,
                  color: ColorConstants.primaryBlack,
                }}>
                {data.user_notification}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.primaryWhite,
  },
  imageContainer: {
    height: 30,
    width: 30,
    borderRadius: 100,
    backgroundColor: ColorConstants.textHintColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationPage;
