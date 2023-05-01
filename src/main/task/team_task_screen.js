import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import {InnerTab} from '../../components/tabs';
import {Loading, NoData} from '../../components/no_data_found';
import TaskTile from '../../components/task_tile';
import {Appbar} from 'react-native-paper';
import movement from 'moment';

const TeamTaskScreen = ({navigation, route}) => {
  const {data} = route.params;
  const [token, setToken] = useState([]);
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState('My Task');
  const [innerSide, setInnerSide] = useState('All');
  const [getTaskData, setTaskData] = useState([]);
  var currentDate = new movement().format('MMM DD, yyyy');

  const taskListUrl = BaseUrl(ApiConstants.myTeamTaskList);

  const checking = async ({type}) => {
    setLoading(true);
    try {
      console.log('this data---', type);
      var token = await AsyncStorage.getItem('token');
      await axios
        .post(taskListUrl, {
          token: token,
          id: data.id,
          type: type,
        })
        .then(response => {
          if (response.status === 200) {
            setTaskData(response.data?.data?.data);
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    checking({type: innerSide});
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.app_bar_header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={data?.name}
          color={ColorConstants.primaryBlack}
          titleStyle={styles.app_bar_title}
        />
        <Appbar.Action
          icon="shape-square-plus"
          color={ColorConstants.primaryBlack}
          onPress={() => {
            navigation.navigate('add_task');
          }}
        />
      </Appbar.Header>
      <View
        style={{
          height: 30,
          backgroundColor: ColorConstants.primaryWhite,
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
        <InnerTab
          tabText={'All'}
          condition={
            innerSide === 'All'
              ? ColorConstants.primaryColor
              : ColorConstants.primaryWhite
          }
          textCondition={
            innerSide === 'All'
              ? ColorConstants.primaryColor
              : ColorConstants.teamHiColor
          }
          onPress={() => {
            setInnerSide('All');
            checking({type: 'All'});
          }}
        />

        <InnerTab
          tabText={'Today'}
          condition={
            innerSide === 'today'
              ? ColorConstants.primaryColor
              : ColorConstants.primaryWhite
          }
          textCondition={
            innerSide === 'today'
              ? ColorConstants.primaryColor
              : ColorConstants.teamHiColor
          }
          onPress={() => {
            setInnerSide('today');
            checking({type: 'today'});
          }}
        />

        <InnerTab
          tabText={'Due'}
          condition={
            innerSide === 'due'
              ? ColorConstants.primaryColor
              : ColorConstants.primaryWhite
          }
          textCondition={
            innerSide === 'due'
              ? ColorConstants.primaryColor
              : ColorConstants.teamHiColor
          }
          onPress={() => {
            setInnerSide('due');
            checking({type: 'due'});
          }}
        />

        <InnerTab
          tabText={'Completed'}
          condition={
            innerSide === 'complete'
              ? ColorConstants.primaryColor
              : ColorConstants.primaryWhite
          }
          textCondition={
            innerSide === 'complete'
              ? ColorConstants.primaryColor
              : ColorConstants.teamHiColor
          }
          onPress={() => {
            setInnerSide('complete');
            checking({type: 'Completed'});
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: 0.5,
          backgroundColor: ColorConstants.textHintColor,
        }}
      />
      {loading === false ? (
        getTaskData.length > 0 ? (
          <ScrollView>
            {getTaskData.map((taskData, index) =>
              innerSide === 'All' ? (
                taskData.task_status === 'Active' ? (
                  <TaskTile
                    key={taskData.title}
                    data={taskData}
                    index={index}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: taskData,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : innerSide === 'today' ? (
                movement(taskData.actual_deadline).format('MMM DD, yyyy') ===
                  currentDate && taskData.task_status === 'Active' ? (
                  <TaskTile
                    key={taskData.title}
                    data={taskData}
                    index={index}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: taskData,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : innerSide === 'due' ? (
                movement(taskData.actual_deadline).format('MMM DD, yyyy') !==
                  currentDate && taskData.task_status === 'Active' ? (
                  <TaskTile
                    key={taskData.title}
                    data={taskData}
                    index={index}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: taskData,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : innerSide === 'complete' ? (
                taskData.task_status === 'Completed' ? (
                  <TaskTile
                    key={taskData.title}
                    data={taskData}
                    index={index}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: taskData,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : (
                <View key={taskData.title}>
                  <Text
                    style={{
                      color: ColorConstants.primaryBlack,
                    }}>
                    {movement(taskData.actual_deadline).format('MMM DD, yyyy')}
                  </Text>
                </View>
              ),
            )}
          </ScrollView>
        ) : (
          <NoData />
        )
      ) : (
        <Loading />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    backgroundColor: ColorConstants.primaryWhite,
  },
  tab_container: {
    height: 48,
    width: '100%',
    borderColor: ColorConstants.primaryColor,
    borderWidth: 3,
    borderRadius: 5,
    flexDirection: 'row',
  },
  progress: {
    backgroundColor: 'white',
  },
  app_bar_header: {
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
  },
  app_bar_title: {
    fontWeight: '700',
    fontSize: 17,
  },
});

export default TeamTaskScreen;
