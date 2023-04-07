import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loading } from '../../components/no_data_found';

const MyAccount = ({navigation, route}) => {
  const {data} = route.params;
  const [isLoading, setLoading] = useState(false);
  const url = BaseUrl(ApiConstants.logOut);

  const logOut = async () => {
    try {
      setLoading(true);
      await AsyncStorage.getItem('token').then(async asyncStorageRes => {
        console.log(
          'this is the data',
          JSON.parse(JSON.stringify(asyncStorageRes)),
        );
        await axios
          .post(url, {
            token: asyncStorageRes,
          })
          .then(async response => {
            if (response.status === 200) {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user_id');
              console.log(await AsyncStorage.clear());
              var token = await AsyncStorage.getItem('token');
              console.log(token);
              navigation.navigate('sign_in');
              console.log(response.data);
              setLoading(false);
            }
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Log out', 'Are you sure to log out ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Log out', onPress: () => logOut()},
    ]);

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 10,
        }}
      />
      <View style={styles.imageContainer}>
        {data.profile_image !== null &&
        data.profile_image.split('.').pop() === 'jpg' ? (
          <Image
            style={styles.imageContainer}
            source={{uri: data.profile_image}}
          />
        ) : (
          <Ionicons name={'person-sharp'} size={35} style={styles.image} />
        )}
      </View>
      <View style={{padding: 5}} />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('edit_profile', {
            data: data,
          });
        }}
        activeOpacity={0.3}>
        <Text
          style={{
            padding: 10,
            color: ColorConstants.editColor,
            fontWeight: '400',
          }}>
          View Profile
        </Text>
      </TouchableOpacity>
      <View style={{padding: 10}} />
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={createTwoButtonAlert}
        accessibilityIgnoresInvertColors={ColorConstants.textHighLight}
        style={{
          backgroundColor: ColorConstants.textHighLight,
          borderRadius: 5,
          height: 40,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: '500',
            color: ColorConstants.primaryWhite,
          }}>
          Log Out
        </Text>
        <Ionicons name={'exit-outline'} size={20} />
      </TouchableOpacity>
      <View />
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.primaryWhite,
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorConstants.textHintColor,
  },
  image: {
    color: ColorConstants.primaryWhite,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default MyAccount;
