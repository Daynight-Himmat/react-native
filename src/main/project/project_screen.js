import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Appbar} from 'react-native-paper';
import {InnerTab} from '../../components/tabs';
import axios from 'axios';
import {ApiConstants, BaseUrl1, BaseUrl} from '../../constants/api_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading, NoData} from '../../components/no_data_found';
import movement from 'moment';
import BottomSheetConditions from '../../components/bottom_sheet_with_condition';
import toastMessage from '../../components/toast_message';
import Dividers from '../../components/divider';
import CommanFunctions from '../../components/comman_functions';
import FontConstants from '../../constants/fonts';
import TaskTile from '../../components/task_tile';
import Condition from '../../components/conditions';
import ColorsCondtion from '../../components/color_condition';
import TimeCondition from '../../components/time_condition';
import {useToast} from 'react-native-toast-notifications';
const {height, width} = Dimensions.get('screen');

const ProjectPageScreen = ({navigation, route}) => {
  const {data} = route.params;
  const toast = useToast();
  const [innerSide, setInnerSide] = useState('All');
  const [checked, setChecked] = useState('High');
  const [isLoading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [getBottomData, setData] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [projectAllTask, setProjectAllTaskList] = useState([]);
  const [projectsDueTask, setProjectDueTaskList] = useState([]);
  const [projectTodayTask, setProjectTodayTaskList] = useState([]);
  const [projectCompleteTask, setProjectCompleteTaskList] = useState([]);
  const projectTaskListUrl = BaseUrl(ApiConstants.projectTaskList);
  const changePriorityUrl = BaseUrl(ApiConstants.changePriority);
  const completeTaskUrl = BaseUrl(ApiConstants.changeTaskStatus);
  const deleteTaskUrl = BaseUrl(ApiConstants.changeTaskDelete);
  var currentDate = new movement().format('MMM DD, yyyy');
  const taskOptionsRef = useRef(null);
  const deleteOptionRef = useRef(null);
  const reopenOptionRef = useRef(null);
  const completeOptionRef = useRef(null);
  const assigneeOptionRef = useRef(null);
  const changePriorityRef = useRef(null);
  const selectAssigneeRef = useRef(null);
  const markAsAprroveRef = useRef(null);

  const getProjectsTaskList = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('user_id');
      const roleId = await AsyncStorage.getItem('role_id');
      setUserId(userId);
      setRoleId(roleId);
      const response = await axios.post(projectTaskListUrl, {
        token: token,
        id: data.id,
      });
      if (response.status === 200) {
        setProjectAllTaskList(
          response.data?.data.filter(item =>
            Condition.activeAndReopen(item.task_status),
          ),
        );
        setProjectTodayTaskList(
          response.data?.data.filter(item =>
            TimeCondition.todayDateCheck(item.created_at.slice(0, 10)),
          ),
        );
        setProjectDueTaskList(
          response.data?.data.filter(
            item =>
              TimeCondition.dueDateCheck(item.created_at.slice(0, 10)) &&
              Condition.activeAndReopen(item.task_status),
          ),
        );
        setProjectCompleteTaskList(
          response.data?.data.filter(item =>
            Condition.StatusCondition(item.task_status),
          ),
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getCompleteTask = async task_status => {
    try {
      setLoading(true);
      // var asyncStorage = await AsyncStorage.getItem('token');
      // var user_id = await AsyncStorage.getItem('user_id');
      // await axios
      //   .post(completeTaskUrl, {
      //     token: asyncStorage,
      //     id: user_id,
      //     task_id: taskId,
      //     task_status: task_status,
      //   })
      return CommanFunctions.getCompleteTask(task_status, getBottomData.id)
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            console.log(task_status);
            navigation.navigate('approve', {
              taskStatus: task_status,
            });
            toastMessage.showMessage(response.data?.message);
          }
        })
        .catch(error => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const getChangePriority = async () => {
    try {
      setLoading(true);
      var asyncStorage = await AsyncStorage.getItem('token');
      var user_id = await AsyncStorage.getItem('user_id');
      const response = await axios.post(changePriorityUrl, {
        token: asyncStorage,
        id: user_id,
        task_id: getBottomData.id,
        priority: checked,
      });
      console.log(response);

      if (response.status === 200) {
        setLoading(false);
        console.log(response.data?.message);
        navigation.navigate('approve', {
          taskStatus: 'Priority',
        });
        changePriorityRef.current.hide();
        toastMessage.showMessage(response.data?.message);
      }
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
            navigation.navigate('approve', {
              taskStatus: 'Delete',
            });
            toastMessage.showMessage(response.data?.message);
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

  const iconPress = data => {
    if (roleId === '1') {
      setData(data);
      console.log(data);
      taskOptionsRef.current.show();
    } else {
      if (userId !== data.user_id.toString()) {
        toastMessage(toast, 'You are not Autherized');
      } else {
        setData(data);
        console.log(data);
        taskOptionsRef.current.show();
      }
    }
  };

  const titlePress = data => {
    console.log(data);
    if (roleId === '1') {
      navigation.navigate('task_details_screen', {
        data: data,
      });
    } else {
      if (userId !== data.user_id.toString()) {
        toastMessage(toast, 'You are not Autherized');
      } else {
        navigation.navigate('task_details_screen', {
          data: data,
        });
      }
    }
  };

  const onRefresh = React.useCallback(() => {
    setLoading(true);

    getProjectsTaskList();
  }, []);

  useEffect(() => {
    getProjectsTaskList();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.app_bar_header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={data.project_name}
          color={ColorConstants.primaryBlack}
          titleStyle={styles.app_bar_title}
        />
        <Appbar.Action
          icon="information-outline"
          color={ColorConstants.primaryColor}
          onPress={() => {
            navigation.navigate('project_info', {
              project_id: data.id,
            });
          }}
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
      <View style={styles.inner_tab_view_style}>
        <InnerTab
          tabText={'All'}
          condition={ColorsCondtion.condition(innerSide, 'All')}
          textCondition={ColorsCondtion.textCondition(innerSide, 'All')}
          onPress={() => {
            setInnerSide('All');
            getProjectsTaskList();
          }}
        />

        <InnerTab
          tabText={'Today'}
          condition={ColorsCondtion.condition(innerSide, 'today')}
          textCondition={ColorsCondtion.textCondition(innerSide, 'today')}
          onPress={() => {
            setInnerSide('today');
            getProjectsTaskList();
          }}
        />

        <InnerTab
          tabText={'Due'}
          condition={ColorsCondtion.condition(innerSide, 'due')}
          textCondition={ColorsCondtion.textCondition(innerSide, 'due')}
          onPress={() => {
            setInnerSide('due');
            getProjectsTaskList();
          }}
        />
        <InnerTab
          tabText={'Completed'}
          condition={ColorsCondtion.condition(innerSide, 'complete')}
          textCondition={ColorsCondtion.textCondition(innerSide, 'complete')}
          onPress={() => {
            setInnerSide('complete');
            getProjectsTaskList();
          }}
        />
      </View>
      <Dividers />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}>
        {innerSide === 'All' ? (
          projectAllTask.length > 0 ? (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                flexGrow: 1,
              }}>
              {projectAllTask.map((all, index) => (
                <TaskTile
                  index={index}
                  data={all}
                  key={index}
                  navigation={() => titlePress(all)}
                  iconPress={() => iconPress(all)}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'today' ? (
          projectTodayTask.length > 0 ? (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }>
              {projectTodayTask.map((today, index) => (
                <TaskTile
                  index={index}
                  data={today}
                  key={index}
                  navigation={() => titlePress(today)}
                  iconPress={() => iconPress(today)}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'due' ? (
          projectsDueTask.length > 0 ? (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }>
              {projectsDueTask.map((due, index) => (
                <TaskTile
                  index={index}
                  data={due}
                  key={index}
                  navigation={() => titlePress(due)}
                  iconPress={() => iconPress(due)}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'complete' ? (
          projectCompleteTask.length > 0 ? (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }>
              {projectCompleteTask.map((complete, index) => (
                <TaskTile
                  index={index}
                  data={complete}
                  key={index}
                  navigation={() => titlePress(complete)}
                  iconPress={() => {
                    if (roleId === '1') {
                      setData(complete);
                      Condition.Completed(complete.task_status) &&
                        taskOptionsRef.current.show();
                    } else {
                      if (userId !== complete.user_id.toString()) {
                        toastMessage(toast, 'You are not Autherized');
                      } else {
                        setData(complete);
                        Condition.Completed(complete.task_status) &&
                          taskOptionsRef.current.show();
                      }
                    }
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
        taskData={getBottomData}
        assigneeOptionRef={assigneeOptionRef}
        selectAssigneeRef={selectAssigneeRef}
        bottomSheetRef={taskOptionsRef}
        project_id={data.id}
        changePriorityRef={changePriorityRef}
        checked={checked}
        completeOptionRef={completeOptionRef}
        deleteOptionRef={deleteOptionRef}
        approveTaskRef={markAsAprroveRef}
        onPressApproved={() => {
          getCompleteTask('Approved');
          taskOptionsRef.current.hide();
          markAsAprroveRef.current.hide();
        }}
        onPressComplete={() => {
          getCompleteTask('Completed');
          taskOptionsRef.current.hide();
          completeOptionRef.current.hide();
        }}
        onPressDelete={() => {
          getDeleteTask();
          taskOptionsRef.current.hide();
          deleteOptionRef.current.hide();
        }}
        onPressPriority={() => {
          taskOptionsRef.current.hide();
          console.log(checked);
          getChangePriority();
        }}
        onPressReopen={() => {
          getCompleteTask('Reopen');
          taskOptionsRef.current.hide();
          reopenOptionRef.current.hide();
        }}
        onValueChange={value => {
          console.log(value);
          setChecked(value);
        }}
        reopenOptionRef={reopenOptionRef}
        status={getBottomData.task_status}
        navigation={navigation}
      />
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
  },
  app_bar_header: {
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
  },
  app_bar_title: {
    fontWeight: '600',
    fontSize: 17,
    fontFamily: FontConstants.semiBold,
  },
  inner_tab_view_style: {
    height: 30,
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});

export default ProjectPageScreen;
