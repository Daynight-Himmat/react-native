import React from 'react';
import {ScrollView, View, RefreshControl} from 'react-native';
import TaskTile from '../../../components/task_tile';
import { NoData } from '../../../components/no_data_found';

const AllTask = ({getData, isLoading, onRefresh,  navigation, iconPress}) => {
  return getData.length > 0 ? (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }>
      {getData.map((due, index) => (
        <TaskTile
          index={index}
          data={due}
          key={index}
          navigation={() => {
            navigation.navigate('task_details_screen', {
              data: due,
            });
          }}
          iconPress={iconPress}
        />
      ))}
    </ScrollView>
  ) : (
    <NoData />
  );
};

export default AllTask;
