import React from 'react';
import {View} from 'react-native';
import movement from 'moment';
import TaskTile from '../../../components/task_tile';

var currentDate = new movement().format('MMM DD, yyyy');

const TodayTask = ({data, index, navigation, iconPress}) => {
  return movement(data.actual_deadline).format('MMM DD, yyyy') ===
    currentDate ? (
    <TaskTile
      key={index}
      data={data}
      index={index}
      iconPress={iconPress}
      onPress={() => {
        navigation.navigate('task_details_screen', {
          data: data,
        });
      }}
    />
  ) : (
    <View key={index} />
  );
};

export default TodayTask;
