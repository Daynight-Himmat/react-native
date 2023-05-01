import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AppSize from './size';

const TexTButton = ({infoText, align, onPressText, callBack}) => {
  return (
    <TouchableOpacity onPress={callBack} style={styles(align).textButtonStyle}>
      <Text style={styles(align).infoTextStyle}>{infoText}</Text>
      <AppSize width={10} />
      <Text style={styles(align).onPressTextStyle}>{onPressText}</Text>
    </TouchableOpacity>
  );
};

const ViewProfileButton = ({text, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.3}>
      <Text style={styles().viewButton}>{text}</Text>
    </TouchableOpacity>
  );
};

export {TexTButton, ViewProfileButton};

const styles = align =>
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
