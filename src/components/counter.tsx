import React, {FunctionComponent} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {Label} from './label';
import FontConstants from '../constants/fonts';

type Props = {
  counter: string;
  counterLabel: string;
  style: any;
  onTap: any;
};

const Counter: FunctionComponent<Props> = ({
  counter,
  counterLabel,
  style,
  onTap,
}) => {
  return (
    <View style={[styles.task_assignee_container, {...style}]}>
      <View style={styles.task_assignee_container_column}>
        <Label
          style={styles.task_assignee_text}
          name={counterLabel}
          margin={undefined}
        />
      </View>
      <TouchableOpacity style={styles.counter_container} onPress={onTap}>
        <Label style={styles.counter_text} name={counter} margin={undefined} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  task_assignee_container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ColorConstants.primaryColor,
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 5,
  },
  task_assignee_container_column: {
    flexDirection: 'column',
    backgroundColor: ColorConstants.primaryColor,
    paddingVertical: 10,
  },
  task_assignee_text: {
    color: ColorConstants.primaryWhite,
    fontWeight: '500',
    fontFamily: FontConstants.semiBold,
  },
  counter_container: {
    height: 30,
    width: 30,
    backgroundColor: ColorConstants.commentContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  counter_text: {
    color: ColorConstants.primaryBlack,
    fontWeight: '600',
    fontSize: 17,
    fontFamily: FontConstants.bold,
  },
});

export default Counter;
