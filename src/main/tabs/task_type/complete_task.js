import React from 'react';
import {View} from 'react-native';
import TaskTile from '../../../components/task_tile';

const CompleteTask = ({data, index, navigation}) => {
  return data.task_status === 'Completed' ? (
    <TaskTile
      key={index}
      data={data}
      index={index}
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

export default CompleteTask;
