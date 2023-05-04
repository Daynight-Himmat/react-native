import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import Feather from 'react-native-vector-icons/Feather';
import {Ionicons} from './icons';
import movement from 'moment';
import {IconButton} from 'react-native-paper';

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
      <View style={styles(data).tile}>
        <View style={styles(data).tile_task_indicator}>
          {data.task_status === 'Completed' ? (
            <View
              style={{
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons
                name={'checkmark-done-sharp'}
                color={ColorConstants.primaryWhite}
              />
            </View>
          ) : (
            <View style={styles(data).indicator_task_pedding} />
          )}
        </View>
        <View style={{padding: 5}} />
        <View style={styles(data).text_column}>
          <Text style={styles(data).task_title}>{data?.task_title}</Text>
          <Text style={styles(data).task_project}>{data.project_name}</Text>
        </View>
        <View style={{padding: 5}} />
        {data.task_status === 'Completed' ? (
          <View style={styles(data).column}>
            <View style={styles(data).row}>
              <Ionicons
                name={'create-outline'}
                color={ColorConstants.textLightBlack1}
              />
              <Text style={styles(data).task_date}>
                {movement(data.created_at).format('DD MMM')}
              </Text>
            </View>
            <View style={styles(data).row}>
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
                  styles(data).task_date,
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
          <View style={styles(data).column}>
            <View style={styles(data).row}>
              <Ionicons
                name={'create-outline'}
                color={ColorConstants.textLightBlack1}
              />
              <Text style={styles(data).task_date}>
                {movement(data.created_at).format('DD MMM')}
              </Text>
            </View>
          </View>
        )}
        <View style={{padding: 5}} />
        <TouchableOpacity onPress={iconPress} style={styles.iconButton}>
          <Feather
            name={'more-vertical'}
            color={ColorConstants.textDarkBlack}
            size={18}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = data =>
  StyleSheet.create({
    tile: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: ColorConstants.textHintColor,
    },
    tile_task_indicator: {
      height: 12,
      width: 12,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: getColor(data),
      // backgroundColor:
      //   data.task_status === 'Active'
      //     ? data.priority === 'High'
      //       ? ColorConstants.highPriorityColor
      //       : ColorConstants.lowPriorityColor
      //     : data.task_status === 'Completed'
      //     ? ColorConstants.buttonGreenColor
      //     : ColorConstants.buttonGreenColor,
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
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
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
      fontWeight: '400',
    },
    column: {
      flexDirection: 'column',
    },
    row: {
      flexDirection: 'row',
    },
    iconButton: {
      width: 30,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
  });

export default TaskTile;
