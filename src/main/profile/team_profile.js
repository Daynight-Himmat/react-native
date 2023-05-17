import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Tile} from '../../components/person_tile';
import {AppHeader} from '../../components/app_header';
import {Avatar} from '@rneui/themed';
import ProfileDemo from '../../components/profile_image_demo';
import toastMessage from '../../components/toast_message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiConstants, BaseUrl1} from '../../constants/api_constants';
import {Loading} from '../../components/no_data_found';
import {Appbar} from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';

const TeamProfile = ({navigation, route}) => {
  const {data} = route.params;
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const deleteUserUrl = BaseUrl1(ApiConstants.destroyUser);

  const deleteUser = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      const response = await axios.post(deleteUserUrl, {
        token: token,
        id: user_Id,
        deleted: 'Yes',
      });
      if (response.status === 200) {
        setLoading(false);
        toastMessage(toast, response.data?.message);
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      console.log('this is the error===', error);
    }
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Delete User', 'Are you sure you want to Delete User ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete User', onPress: () => deleteUser()},
    ]);

  return (
    <View style={styles.container}>
      <AppHeader
        text={data?.name}
        navigate={() => navigation.goBack()}
        action={
          data?.rote_id === 1 && <Appbar.Action
            icon={'delete'}
            color={ColorConstants.textHighLight}
            onPress={() => createTwoButtonAlert()}
          />
        }
        icon2={data?.role_id === 1 && 'delete'}
        icon2Press={() => data?.role_id === 1 && createTwoButtonAlert()}
      />
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() =>
          navigation.navigate('profile_image', {
            data: data,
            comeFrom : "Profile Image"
          })
        }>
        {data.profile_image != null &&
        data.profile_image.split('.').pop() === 'jpg' ? (
          <Avatar
            size={120}
            rounded
            renderPlaceholderContent={<ActivityIndicator />}
            placeholderStyle={{backgroundColor: ColorConstants.primaryWhite}}
            source={{
              uri: data.profile_image,
            }}
          />
        ) : (
          <ProfileDemo
            containerSize={{
              height: 100,
              width: 100,
            }}
            iconSize={30}
          />
        )}
      </TouchableOpacity>

      <View style={styles.tile_column}>
        <Tile
          image={require('../../../assets/images/business.png')}
          title={data.name ?? 'No Name Found'}
        />
        <Tile
          image={require('../../../assets/images/emails.png')}
          title={data.email ?? 'No Email Found'}
        />
        <Tile
          image={require('../../../assets/images/phone.png')}
          title={data.mobile ?? 'No Number Found'}
        />
        <Tile
          image={require('../../../assets/images/designation.png')}
          title={data.designation ?? 'No Designation Found'}
        />
      </View>
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
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

  tile_column: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  tile_container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
  },
  tile_text_style: {
    color: ColorConstants.primaryBlack,
    fontSize: 14,
    fontWeight: '400',
  },
  tile_leading_icon: {
    height: 24,
    width: 24,
  },
});

export default TeamProfile;
