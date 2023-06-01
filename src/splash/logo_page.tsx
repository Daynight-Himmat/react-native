/* eslint-disable react-hooks/exhaustive-deps */
import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, StyleSheet, Modal, Linking, BackHandler, Platform} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommanFunctions from '../components/comman_functions';
import axiosInstance from '../components/interceptor';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import ModelView from '../components/model';
import {HighLightLabel, Label} from '../components/label';
import RowButton from '../components/row_button';
import AppSize from '../components/size';
import {Loading} from '../components/no_data_found';

type Props = {
  navigation: any;
};

const LogoPage: FunctionComponent<Props> = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [getVersionData, setVersionData] = useState(false);
  const [getUpdateData, setUpdateData] = useState('');
  const getVersionCheck = BaseUrl(ApiConstants.appVersion);
  const packageURL = 'market://details?id=com.phppoets.project_management';

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

  const getVersion = async () => {
    try {
      const response = await axiosInstance.get(getVersionCheck);
      if (response.status === 200) {
        setUpdateData(response.data?.data.messege);
        console.log(response.data?.data.Version);
        if(Platform.OS === 'ios'){
          setTimeout(() => {
            goRoute();
          }, 1000);
        }else if (response.data?.data.Version > 19) {
          setVersionData(true);
        } else {
          console.log('Your app is up to date');
          setTimeout(() => {
            goRoute();
          }, 1000);
        }
      }
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVersion();
  }, []);

  return (
    <View style={styles.container}>
      <Modal visible={getVersionData}>
        <ModelView
          widget={
            <View>
              <View style={styles.center}>
                <HighLightLabel hightLightLabel="New Update is Available" />
              </View>
              <AppSize height={10} width={undefined} />
              <Label name={getUpdateData} style={undefined} margin={0} />
              <AppSize height={10} width={undefined} />
              <RowButton
                onPress={() => Linking.openURL(packageURL)}
                onback={() => BackHandler.exitApp()}
                text={'Update'}
                textStyle={undefined}
              />
            </View>
          }
        />
      </Modal>
      {isLoading && <Loading />}
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
  center: {
    alignSelf: 'center',
  },
});

export default LogoPage;
