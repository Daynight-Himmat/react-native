import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import {InnerTab} from '../../components/tabs';
import {Loading, NoData} from '../../components/no_data_found';
import {Appbar} from 'react-native-paper';
import movement from 'moment';
import Dividers from '../../components/divider';
import AllTask from '../tabs/task_type/all_task';
import BottomSheetConditions from '../../components/bottom_sheet_with_condition';
import ToastMessage from '../../components/toast_message';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FontConstants from '../../constants/fonts';

const Tab = createMaterialTopTabNavigator();

const TeamTaskScreen = ({navigation, route}) => {
  const {data} = route.params;
  const [token, setToken] = useState([]);
  const [checked, setChecked] = useState('High');
  const [taskId, setTaskId] = useState('');
  const [loading, setLoading] = useState(false);
  const [allTask, setAllTaskList] = useState([]);
  const [dueTask, setDueTaskList] = useState([]);
  const [todayTask, setTodayTaskList] = useState([]);
  const [completeTask, setCompleteTaskList] = useState([]);
  const [side, setSide] = useState('My Task');
  const [innerSide, setInnerSide] = useState('All');
  const [getTaskData, setTaskData] = useState([]);
  const [getBottomData, setData] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const taskOptionsRef = useRef(null);
  const deleteOptionRef = useRef(null);
  const reopenOptionRef = useRef(null);
  const completeOptionRef = useRef(null);
  const assigneeOptionRef = useRef(null);
  const changePriorityRef = useRef(null);
  const selectAssigneeRef = useRef(null);
  const approveTaskRef = useRef(null);
  const taskListUrl = BaseUrl(ApiConstants.myTeamTaskList);
  const changePriorityUrl = BaseUrl(ApiConstants.changePriority);
  const completeTaskUrl = BaseUrl(ApiConstants.changeTaskStatus);
  const deleteTaskUrl = BaseUrl(ApiConstants.changeTaskDelete);

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
            if (response.status === 200) {
              setAllTaskList(
                response.data.data?.data.filter(
                  item =>
                    item.task_status === 'Active' ||
                    item.task_status === 'Reopen',
                ),
              );
              setTodayTaskList(
                response.data.data?.data.filter(
                  item =>
                    movement(item.created_at.slice(0, 10)).format(
                      'yyyy-MM-DD',
                    ) === movement().format('yyyy-MM-DD'),
                ),
              );
              setDueTaskList(
                response.data.data?.data.filter(
                  item =>
                    movement(item.created_at.slice(0, 10)).format(
                      'yyyy-MM-DD',
                    ) !== movement().format('yyyy-MM-DD') &&
                    item.task_status !== 'Completed',
                ),
              );
              setCompleteTaskList(
                response.data.data?.data.filter(
                  item =>
                    item.task_status === 'Completed' ||
                    item.task_status === 'Approved',
                ),
              );
              setLoading(false);
            }
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

  const getCompleteTask = async task_status => {
    try {
      setLoading(true);
      var asyncStorage = await AsyncStorage.getItem('token');
      var user_id = await AsyncStorage.getItem('user_id');
      await axios
        .post(completeTaskUrl, {
          token: asyncStorage,
          id: user_id,
          task_id: taskId,
          task_status: task_status,
        })
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            checking({type: 'All'});
            navigation.navigate('approve', {
              taskStatus: task_status,
            });
            ToastMessage.showMessage(response.data?.message);
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const getChangePriority = async (taskId, priority) => {
    try {
      setLoading(true);
      var asyncStorage = await AsyncStorage.getItem('token');
      var user_id = await AsyncStorage.getItem('user_id');
      await axios
        .post(changePriorityUrl, {
          token: asyncStorage,
          id: user_id,
          task_id: taskId,
          priority: priority,
        })
        .then(response => {
          if (response.status === 200) {
            console.log(response.data?.message);
            setLoading(false);
            checking({type: 'All'});
            navigation.navigate('approve', {
              taskStatus: 'Priority',
            });
            changePriorityRef.current.hide();
            ToastMessage.showMessage(response.data?.message);
          }
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const getDeleteTask = async () => {
    try {
      setLoading(true);
      var asyncStorage = await AsyncStorage.getItem('token');
      var user_id = await AsyncStorage.getItem('user_id');
      await axios
        .post(deleteTaskUrl, {
          token: asyncStorage,
          id: user_id,
          task_id: taskId,
        })
        .then(response => {
          if (response.status === 200) {
            console.log(response.data?.message);
            setLoading(false);
            checking({type: 'All'});
            navigation.navigate('approve', {
              taskStatus: 'Delete',
            });
            ToastMessage.showMessage(response.data?.message);
          }
        })
        .catch(error => {
          console.log(error);
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
            navigation.navigate('add_task', {
              data: [],
              comeFrom: 'create_Task',
            });
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
      <Dividers />
      <View style={{flex: 1, paddingHorizontal: 10}}>
        {innerSide === 'All' ? (
          allTask.length > 0 ? (
            <ScrollView>
              {allTask.map((data, index) => (
                <AllTask
                  data={data}
                  key={index}
                  navigation={navigation}
                  iconPress={() => {
                    setData(data);
                    setTaskId(data.id);
                    setProjectId(data.project_id);
                    setTaskStatus(data.task_status);
                    taskOptionsRef.current.show();
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'today' ? (
          todayTask.length > 0 ? (
            <ScrollView>
              {todayTask.map((data, index) => (
                <AllTask
                  data={data}
                  key={index}
                  navigation={navigation}
                  iconPress={() => {
                    setData(data);
                    setTaskId(data.id);
                    setProjectId(data.project_id);
                    setTaskStatus(data.task_status);
                    taskOptionsRef.current.show();
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'due' ? (
          dueTask.length > 0 ? (
            <ScrollView>
              {dueTask.map((data, index) => (
                <AllTask
                  data={data}
                  key={index}
                  navigation={navigation}
                  iconPress={() => {
                    setData(data);
                    setTaskId(data.id);
                    setProjectId(data.project_id);
                    setTaskStatus(data.task_status);
                    taskOptionsRef.current.show();
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'complete' ? (
          completeTask.length > 0 ? (
            <ScrollView>
              {completeTask.map((data, index) => (
                <AllTask
                  data={data}
                  key={index}
                  navigation={navigation}
                  iconPress={() => {
                    setData(data);
                    setTaskId(data.id);
                    setProjectId(data.project_id);
                    setTaskStatus(data.task_status);
                    taskOptionsRef.current.show();
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : (
          <NoData />
        )}
      </View>
      <BottomSheetConditions
        assigneeOptionRef={assigneeOptionRef}
        selectAssigneeRef={selectAssigneeRef}
        approveTaskRef={approveTaskRef}
        project_id={getBottomData.project_id}
        bottomSheetRef={taskOptionsRef}
        changePriorityRef={changePriorityRef}
        checked={checked}
        completeOptionRef={completeOptionRef}
        deleteOptionRef={deleteOptionRef}
        onPressComplete={() => {
          getCompleteTask('Completed');
          completeOptionRef.current.hide();
        }}
        onPressDelete={() => {
          getDeleteTask();
          deleteOptionRef.current.hide();
        }}
        onPressApproved={() => {
          getCompleteTask('Approve');
          approveTaskRef.current.hide();
        }}
        onPressPriority={() => getChangePriority(taskId, checked)}
        onPressReopen={() => {
          getCompleteTask('Reopen');
          reopenOptionRef.current.hide();
        }}
        onValueChange={value => setChecked(value)}
        reopenOptionRef={reopenOptionRef}
        status={taskStatus}
      />
      {loading && <Loading />}
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
    fontWeight: '600',
    fontSize: 17,
    fontFamily: FontConstants.semiBold
  },
});

export default TeamTaskScreen;
