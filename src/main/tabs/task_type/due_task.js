import React from 'react';
import {View} from 'react-native';
import movement from 'moment';
import TaskTile from '../../../components/task_tile';

var currentDate = new movement().format('MMM DD, yyyy');

const DueTask = ({route, index, navigation, iconPress}) => {
  const {data} = route.params;
  return (
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
  );
};

export default DueTask;
