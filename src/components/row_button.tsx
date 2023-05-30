import React, {FunctionComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AppButton from './app_button';
import AppSize from './size';

type Props = {
  text: string;
  textStyle: any;
  onback: any;
  onPress: any;
};

const RowButton: FunctionComponent<Props> = ({
  text,
  textStyle,
  onback,
  onPress,
}) => {
  return (
    <View style={styles.bottomButtonRow}>
      <AppButton
        text={'Cancel'}
        style={styles.cencal}
        textStyle={{
          color: ColorConstants.primaryColor,
        }}
        onPress={onback}
      />
      <AppSize width={10} height={undefined} />
      <AppButton
        text={text}
        style={styles.button}
        onPress={onPress}
        textStyle={textStyle}
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
    alignSelf: 'center',
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
