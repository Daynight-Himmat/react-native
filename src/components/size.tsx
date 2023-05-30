import React, {FunctionComponent} from 'react';
import {View, StyleSheet} from 'react-native';

type Props = {
  height: any;
  width: any;
};

const AppSize: FunctionComponent<Props> = ({height, width}) => {
  return <View style={styles(height, width).container} />;
};

const styles = (height: any, width: any) =>
  StyleSheet.create({
    container: {
      height: height ?? 0,
      width: width ?? 0,
    },
  });

export default AppSize;
