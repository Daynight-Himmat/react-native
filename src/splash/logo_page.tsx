/* eslint-disable react-hooks/exhaustive-deps */
import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading} from '../components/no_data_found';
import CommanFunctions from '../components/comman_functions';

type Props = {
  navigation: any;
}

const LogoPage: FunctionComponent<Props> = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);

  const goRoute = async () => {
    try {
      setLoading(true);
      var userId = await AsyncStorage.getItem('user_id');
      var isFirstTime = await AsyncStorage.getItem('isFirstTime');
      if (isFirstTime === 'true') {
        setLoading(false);
        CommanFunctions.routing(navigation, 'sign_in');
      } 
      if (userId) {
        setLoading(false);
        CommanFunctions.routing(navigation, 'dashboard');
      } else {
        setLoading(false);
        CommanFunctions.routing(navigation, 'splash');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      goRoute();
    }, 1000);
  }, []);

  return <View style={styles.container}>{isLoading && <Loading />}</View>;
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
