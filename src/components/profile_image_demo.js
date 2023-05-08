import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConstants from '../constants/color_constants';

const ProfileDemo = ({containerSize, iconSize}) => {
  return (
    <View style={[styles.profileImage, {...containerSize}]}>
      <Ionicons name={'person-sharp'} size={iconSize} style={styles.image} />
    </View>
  );
};

export default ProfileDemo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    backgroundColor: ColorConstants.textLightBlack3,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: ColorConstants.greyColor,
    borderWidth: 1,
  },
  image: {
    color: ColorConstants.greyColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});
