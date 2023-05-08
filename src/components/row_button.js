import React from 'react';
import {View, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AppButton from './app_button';
import AppSize from './size';

const RowButton = ({
  text: buttonName,
  textStyle: textStyle,
  onback: onBack,
  onPress: onTap,
  route: navigation,
  style: bottonStyle,
}) => {
  return (
    <View style={styles.bottomButtonRow}>
      <AppButton
        text={'Cancel'}
        style={styles.cencal}
        textStyle={{
          color: ColorConstants.primaryColor,
        }}
        onPress={onBack}
      />
      <AppSize width={10} />
      <AppButton
        text={buttonName}
        style={[styles.button, {...bottonStyle}]}
        onPress={onTap}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: ColorConstants.primaryWhite,
    textAlign: 'center',
  },
  bottomButtonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: ColorConstants.primaryWhite,
  },
  cencal: {
    flex: 1,
    backgroundColor: ColorConstants.primaryWhite,
    borderColor: ColorConstants.primaryColor,
    borderWidth: 2,
    borderRadius: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RowButton;
