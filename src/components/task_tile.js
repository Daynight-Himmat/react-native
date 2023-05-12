import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import Feather from 'react-native-vector-icons/Feather';
import {Ionicons} from './icons';
import movement from 'moment';
import {IconButton} from 'react-native-paper';
import {Label, LightText1} from './label';
import FontConstants from '../constants/fonts';

const getColor = data => {
  switch (data.task_status) {
    case 'Completed':
      return ColorConstants.yellowCompleteColor;
    case 'Active':
      return data.priority === 'High'
        ? ColorConstants.highPriorityColor
        : ColorConstants.lowPriorityColor;
    case 'Reopen':
      return data.priority === 'High'
        ? ColorConstants.highPriorityColor
        : ColorConstants.lowPriorityColor;
    case 'Approved':
      return ColorConstants.buttonGreenColor;
  }
};

const TaskTile = ({index, data, onPress, iconPress}) => {
  var currentDate = new movement().format('MMM DD, yyyy');

  return (
    <TouchableOpacity key={data.title} onPress={onPress}>
      <View style={styles.tile}>
        <View
          style={[
            styles.tile_task_indicator,
            {backgroundColor: getColor(data)},
          ]}>
          {data.task_status === 'Completed' ? (
            <View>
              <Ionicons
                name={'checkmark-done-sharp'}
                color={ColorConstants.primaryWhite}
                size={8}
              />
            </View>
          ) : (
            <View style={styles.indicator_task_pedding} />
          )}
        </View>

        <View style={styles.text_column}>
          <Label name={data?.task_title} />
          <LightText1 lightText1={data.project_name} />
        </View>
        {data.task_status === 'Completed' ? (
          <View>
            <View style={styles.row}>
              <Ionicons
                name={'create-outline'}
                color={ColorConstants.textLightBlack1}
              />
              <Text style={styles.task_date}>
                {movement(data.created_at).format('DD MMM')}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons
                name={'checkmark-done-sharp'}
                color={
                  currentDate ===
                  movement(data.updated_at).format('MMM DD, yyyy')
                    ? ColorConstants.buttonGreenColor
                    : ColorConstants.highPriorityColor
                }
              />
              <Text
                style={[
                  styles.task_date,
                  {
                    color:
                      currentDate ===
                      movement(data.updated_at).format('MMM DD, yyyy')
                        ? ColorConstants.buttonGreenColor
                        : ColorConstants.highPriorityColor,
                  },
                ]}>
                {movement(data.updated_at).format('DD MMM')}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.row}>
              <Ionicons
                name={'create-outline'}
                color={ColorConstants.textLightBlack1}
              />
              <Text style={styles.task_date}>
                {movement(data.created_at).format('DD MMM')}
              </Text>
            </View>
          </View>
        )}
        <IconButton
          icon={'dots-vertical'}
          onPress={iconPress}
          size={18}
          style={styles.iconButton}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: ColorConstants.textHintColor,
  },
  tile_task_indicator: {
    height: 12,
    width: 12,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  indicator_task_pedding: {
    height: 5,
    width: 5,
    borderRadius: 100,
    backgroundColor: ColorConstants.primaryWhite,
  },
  text_column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  task_title: {
    color: ColorConstants.textDarkBlack,
    fontSize: 14,
    fontWeight: '400',
  },
  task_project: {
    color: ColorConstants.textLightBlack1,
    fontSize: 10,
    fontWeight: '400',
  },
  task_date: {
    color: ColorConstants.textLightBlack1,
    fontSize: 10,
    fontWeight: '600',
    fontFamily: FontConstants.light,
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default TaskTile;
