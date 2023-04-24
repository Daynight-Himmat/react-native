import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import {InnerTab, TabContainer} from '../../components/tabs';
import {Loading, NoData} from '../../components/no_data_found';
import TaskTile from '../../components/task_tile';
import movement from 'moment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const HomeScreen = ({navigation}) => {
  const [token, setToken] = useState([]);
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState('My Task');
  const [innerSide, setInnerSide] = useState('All');
  const [getTaskData, setTaskData] = useState([]);
  const [getAssigneeTaskData, setAssigneeTaskData] = useState([]);
  var currentDate = new movement().format('MMM DD, yyyy');

  const taskListUrl = BaseUrl(ApiConstants.myTaskList);
  const taskAssigneeListUrl = BaseUrl(ApiConstants.taskAssignList);
  const Tab = createMaterialTopTabNavigator();

  const checking = async ({type}) => {
    try {
      setLoading(true);
      var userId = await AsyncStorage.getItem('user_id');
      var asyncStorageRes = await AsyncStorage.getItem('token');
      console.log('this data---', type);
      axios
        .post(taskListUrl, {
          token: asyncStorageRes,
          id: userId,
          type: type && 'All',
        })
        .then(response => {
          if (response.status === 200) {
            setTaskData(response.data.data?.data);
            setLoading(false);
            console.log(response.data.data?.data.slice(0, 1));
            for (var i = 0; i < getTaskData?.length; i++) {
              setTaskDate(getTaskData[i]?.created_at);
              // console.log(
              //   movement(getTaskData[i]?.created_at).format('MMM DD, yyyy'),
              // );
            }
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });

      axios
        .post(taskAssigneeListUrl, {
          token: asyncStorageRes,
          id: userId,
          type: type,
        })
        .then(response => {
          if (response.status === 200) {
            setAssigneeTaskData(response.data.data?.data);
            setLoading(false);
            console.log(response.data.data?.data.slice(0, 1));
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      setLoading(false);
      console.log(`this data ${error}`);
    }
  };

  useEffect(() => {
    checking({type: innerSide});
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tab_container}>
        <TabContainer
          condition={
            side === 'My Task'
              ? ColorConstants.primaryColor
              : ColorConstants.primaryWhite
          }
          textCondition={
            side === 'My Task'
              ? ColorConstants.primaryWhite
              : ColorConstants.primaryColor
          }
          onPress={() => {
            setSide('My Task');
            checking({type: innerSide});
          }}
          buttonName={'My Task'}
        />
        <TabContainer
          condition={
            side === 'My Task'
              ? ColorConstants.primaryWhite
              : ColorConstants.primaryColor
          }
          textCondition={
            side !== 'My Task'
              ? ColorConstants.primaryWhite
              : ColorConstants.primaryColor
          }
          onPress={() => {
            setSide('My Assignee');
            checking({type: innerSide});
          }}
          buttonName={'Assined Task'}
        />
      </View>
      <View style={{padding: 5}} />
      <View
        style={{
          height: 30,
          backgroundColor: ColorConstants.primaryWhite,
          flexDirection: 'row',
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
      <View style={{padding: 2}} />
      <View
        style={{
          width: '100%',
          height: 0.5,
          backgroundColor: ColorConstants.textHintColor,
        }}
      />
      {loading === false ? (
        side === 'My Task' ? (
          getTaskData.length > 0 ? (
            <ScrollView>
              {getTaskData.map((data, index) =>
                innerSide === 'All' ? (
                  data.task_status === 'Active' ? (
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
                  )
                ) : innerSide === 'today' ? (
                  movement(data.actual_deadline).format('MMM DD, yyyy') ===
                  currentDate ? (
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
                  )
                ) : innerSide === 'due' ? (
                  movement(data.actual_deadline).format('MMM DD, yyyy') !==
                    currentDate && data.task_status === 'Active' ? (
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
                  )
                ) : innerSide === 'complete' ? (
                  data.task_status === 'Completed' ? (
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
                  )
                ) : (
                  <View key={index}>
                    <Text
                      style={{
                        color: ColorConstants.primaryBlack,
                      }}>
                      {movement(data.actual_deadline).format('MMM DD, yyyy')}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : getAssigneeTaskData.length > 0 ? (
          <ScrollView>
            {getAssigneeTaskData.map((data, index) =>
              innerSide === 'All' ? (
                data.task_status === 'Active' ? (
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
                )
              ) : innerSide === 'today' ? (
                movement(data.actual_deadline).format('MMM DD, yyyy') ===
                  currentDate && data.task_status === 'Active' ? (
                  <TaskTile
                    key={data.title}
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
                )
              ) : innerSide === 'due' ? (
                movement(data.actual_deadline).format('MMM DD, yyyy') !==
                  currentDate && data.task_status === 'Active' ? (
                  <TaskTile
                    key={data.title}
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
                )
              ) : innerSide === 'complete' ? (
                data.task_status === 'Completed' ? (
                  <TaskTile
                    key={data.title}
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
                )
              ) : (
                <View key={data.title}>
                  <Text
                    style={{
                      color: ColorConstants.primaryBlack,
                    }}>
                    {movement(data.actual_deadline).format('MMM DD, yyyy')}
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
    padding: 10,
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
});

export default HomeScreen;
