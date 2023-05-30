import React, {FunctionComponent} from 'react';
import {StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {Divider} from 'react-native-paper';

type Props = {
  h1: any;
  w1: any;
  mv: number;
};

const Dividers: FunctionComponent<Props> = ({h1, w1, mv}) => {
  return <Divider style={styles(h1, w1, mv).divider} />;
};

const styles = (h1: any, w1: any, mv: number) =>
  StyleSheet.create({
    divider: {
      height: h1 ?? 1,
      width: w1 ?? '100%',
      marginVertical: mv ?? 5,
      backgroundColor: ColorConstants.textLightBlack3,
    },
  });

export default Dividers;
