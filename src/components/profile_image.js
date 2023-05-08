import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import AppHeader from './app_header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConstants from '../constants/color_constants';
import FontConstants from '../constants/fonts';

const ProfileImage = ({route, navigation}) => {
  const {data} = route.params;

  return (
    <View style={styles.container}>
      <AppHeader text={data?.name} navigate={()=> navigation.goBack()} />
      <View style={styles.imageContainer}>
        {data.profile_image != null &&
        data.profile_image.split('.').pop() === 'jpg' ? (
          <Image
            style={styles.imageContainer}
            source={{uri: data.profile_image}}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: ColorConstants.textLightBlack3,
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                borderColor: ColorConstants.primaryBlack,
                borderWidth: 2,
              }}>
              <Ionicons name={'person-sharp'} size={25} style={styles.image} />
            </View>
            <View>
              <Text
                style={{
                  color: ColorConstants.primaryBlack,
                  marginTop: 10,
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontFamily: FontConstants.ragular
                }}>
                {' '}
                No Image Found{' '}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: ColorConstants.primaryWhite,
  },
  imageContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  image: {
    color: ColorConstants.primaryBlack,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});
