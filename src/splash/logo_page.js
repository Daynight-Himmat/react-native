import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Icons from '../../assets/images/icons.svg';
import ColorConstants from '../constants/color_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoPage = ({navigation}) => {
  const goRoute = async () => {
    var userId = await AsyncStorage.getItem('user_id');
    var isFirstTime = await AsyncStorage.getItem('isFirstTime');
    if (isFirstTime === 'true') {
      navigation.navigate('splash');
      console.log(`this is if part ${isFirstTime}`);
    } else if (userId !== null) {
      navigation.navigate('dashboard');
    } else {
      console.log(`this is else part ${isFirstTime}`);
      navigation.navigate('splash');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      goRoute();
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <Icons height={100} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorConstants.primaryWhite,
  },
});

export default LogoPage;
