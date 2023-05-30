import React, {FunctionComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {Label} from './label';
import RowButton from './row_button';
import AppSize from './size';

type Props = {
  navigation: any;
  label: string;
  buttonLabel: string;
  onPress: any;
  onBack: any;
  style: any;
};

const TaskAlert: FunctionComponent<Props> = ({
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
        <Label name={label} style={undefined} margin={undefined} />
      </View>
      <RowButton
        text={buttonLabel}
        route={navigation}
        onPress={onPress}
        onback={onBack}
        style={style}
        textStyle={undefined}
      />
      <AppSize height={20} width={undefined} />
    </View>
  );
};

export default TaskAlert;

const styles = StyleSheet.create({
  view: {backgroundColor: ColorConstants.primaryWhite},
  textContainer: {alignSelf: 'center', marginBottom: 10},
});
