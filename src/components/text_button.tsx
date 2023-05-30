import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AppSize from './size';

type Props = {
  infoText: string;
  align: any;
  onPressText: string;
  callBack: any;
};

const TexTButton: FunctionComponent<Props> = ({
  infoText,
  align,
  onPressText,
  callBack,
}) => {
  return (
    <TouchableOpacity onPress={callBack} style={styles(align).textButtonStyle}>
      <Text style={styles(align).infoTextStyle}>{infoText}</Text>
      <AppSize width={10} height={undefined} />
      <Text style={styles(align).onPressTextStyle}>{onPressText}</Text>
    </TouchableOpacity>
  );
};

type Props1 = {
  text: string;
  onPress: any;
};

const ViewProfileButton: FunctionComponent<Props1> = ({text, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.3}>
      <Text style={styles(undefined).viewButton}>{text}</Text>
    </TouchableOpacity>
  );
};

export {TexTButton, ViewProfileButton};

const styles = (align: undefined) =>
  StyleSheet.create({
    textButtonStyle: {
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: align ?? 'center',
      flexDirection: 'row',
      paddingVertical: 10,
    },
    infoTextStyle: {
      fontSize: 14,
      color: ColorConstants.primaryBlack,
      fontWeight: '400',
    },
    onPressTextStyle: {
      fontSize: 14,
      color: ColorConstants.primaryColor,
      fontWeight: '400',
      textDecorationColor: ColorConstants.primaryColor,
      textDecorationLine: 'underline',
    },
    viewButton: {
      padding: 10,
      color: ColorConstants.editColor,
      fontWeight: '400',
    },
  });
