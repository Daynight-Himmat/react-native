import React from 'react';
import {View} from 'react-native';
import TaskTile from '../../../components/task_tile';

const AllTask = ({data, index, navigation, iconPress}) => {
  return <TaskTile
      key={index}
      data={data}
      index={index}
      iconPress={iconPress}
      onPress={() => {
        navigation.navigate('task_details_screen', {
          data: data,
        });
      }}
    />;
};

export default AllTask;
