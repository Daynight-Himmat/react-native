import React from 'react';
import {View, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';

const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    backgroundColor: ColorConstants.textLightBlack3,
  },
});

export default Divider;
