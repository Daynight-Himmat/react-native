import React from 'react';
import {View} from 'react-native';
import TaskTile from '../../../components/task_tile';

const AllTask = ({data, index, navigation, iconPress}) => {
  return data.task_status === 'Active' || data.task_status === 'Reopen' ? (
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

export default AllTask;
