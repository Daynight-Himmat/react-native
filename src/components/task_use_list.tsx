/* eslint-disable react-hooks/exhaustive-deps */
import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {AppHeader} from './app_header';
import {PersonTile} from './person_tile';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NoData} from './no_data_found';

type Props = {
  route: any;
  navigation: any;
};

interface UserData {
  id: string;
  name: string;
}

const TaskAssigee: FunctionComponent<Props> = ({navigation, route}) => {
  const {header, taskId, projectId} = route.params;
  const [getUser, setUser] = useState<UserData[]>([]);

  console.log(taskId, projectId);

  const getUseData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const resposne = await axios.post(BaseUrl(ApiConstants.getUserList), {
        token: token,
      });
      if (header === 'Task Assignee') {
        if (resposne.status === 200) {
          if (taskId) {
            setUser(
              resposne.data?.data.filter(
                (d: {id: string}) => d.id.toString() === taskId.toString(),
              ),
            );
          }
        }
      } else {
        const res = await axios.post(BaseUrl(ApiConstants.projectDetails), {
          token: token,
          id: projectId,
        });
        if (res.status === 200) {
          console.log(res.data?.data);
          for (var index = 0; index < res.data?.data.length; index++) {
            setUser(res.data?.data[index].cordinator_name);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUseData();
  }, [getUseData]);

  return (
    <View style={styles.container}>
      <AppHeader
        navigate={() => navigation.goBack()}
        text={header}
        action={undefined}
      />
      {getUser.length > 0 ? (
        <ScrollView style={styles.padding}>
          {getUser.map((item, _index) => (
            <PersonTile
              key={_index}
              title={item?.name ?? ''}
              image={null}
              index={undefined}
              tilePress={undefined}
              imagePress={undefined}
              subTitle={undefined}
            />
          ))}
        </ScrollView>
      ) : (
        <NoData />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorConstants.primaryWhite,
  },
  padding: {
    paddingHorizontal: 10,
  },
});

export default TaskAssigee;
