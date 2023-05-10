import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import FontConstants from '../constants/fonts';

const AppButton = ({
  text: buttonName,
  style: style,
  textStyle: textStyle,
  onPress: onTap,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, style]}
      onPress={onTap}>
      <Text style={[styles.buttonText, {...textStyle}]}>{buttonName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorConstants.primaryColor,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: ColorConstants.primaryWhite,
    textAlign: 'center',
    fontFamily: FontConstants.semiBold,
  },
});

export default AppButton;
