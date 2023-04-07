import React from 'react';
import {View, StyleSheet} from 'react-native';

const AppSize = ({height: height, width: width}) => {
  return <View style={styles(height, width).container} />;
};

const styles = (height, width) =>
  StyleSheet.create({
    container: {
      height: height ?? 0,
      width: width ?? 0,
    },
  });

export default AppSize;
