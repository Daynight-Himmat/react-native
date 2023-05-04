import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {Label} from './label';
import {Tile} from './person_tile';
import RowButton from './row_button';
import AppSize from './size';

const TaskAlert = ({
  navigation,
  label,
  buttonLabel,
  onPress,
  onBack,
  style,
}) => {
  return (
    <View style={styles.view}>
      <View style={styles.textContainer}>
        <Label name={label} />
      </View>
      <RowButton
        text={buttonLabel}
        route={navigation}
        onPress={onPress}
        onback={onBack}
        style={style}
      />
      <AppSize height={20} />
    </View>
  );
};

export default TaskAlert;

const styles = StyleSheet.create({
  view: {
    backgroundColor: ColorConstants.primaryWhite,
  },
  textContainer: {alignSelf: 'center'},
});
