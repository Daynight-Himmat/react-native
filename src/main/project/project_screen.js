import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Appbar} from 'react-native-paper';
import {InnerTab} from '../../components/tabs';
import axios from 'axios';
import {ApiConstants, BaseUrl1} from '../../constants/api_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading, NoData} from '../../components/no_data_found';
import movement from 'moment';
import BottomSheetConditions from '../../components/bottom_sheet_with_condition';
import ToastMessage from '../../components/toast_message';
import AllTask from '../tabs/task_type/all_task';
import Dividers from '../../components/divider';
import CommanFunctions from '../../components/comman_functions';
import FontConstants from '../../constants/fonts';
const {height, width} = Dimensions.get('screen');

const ProjectPageScreen = ({navigation, route}) => {
  const {data} = route.params;
  const [innerSide, setInnerSide] = useState('All');
  const [checked, setChecked] = useState('High');
  const [isLoading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [getBottomData, setData] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [projectAllTask, setProjectAllTaskList] = useState([]);
  const [projectsDueTask, setProjectDueTaskList] = useState([]);
  const [projectTodayTask, setProjectTodayTaskList] = useState([]);
  const [projectCompleteTask, setProjectCompleteTaskList] = useState([]);
  const projectTaskListUrl = BaseUrl1(ApiConstants.projectTaskList);
  const changePriorityUrl = BaseUrl1(ApiConstants.changePriority);
  const completeTaskUrl = BaseUrl1(ApiConstants.changeTaskStatus);
  const deleteTaskUrl = BaseUrl1(ApiConstants.changeTaskDelete);
  var currentDate = new movement().format('MMM DD, yyyy');
  const taskOptionsRef = useRef(null);
  const deleteOptionRef = useRef(null);
  const reopenOptionRef = useRef(null);
  const completeOptionRef = useRef(null);
  const assigneeOptionRef = useRef(null);
  const changePriorityRef = useRef(null);

  const getProjectsTaskList = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(projectTaskListUrl, {
        token: token,
        id: data.id,
      });
      if (response.status === 200) {
        setProjectAllTaskList(
          response.data?.data.filter(item => item.task_status === 'Active'),
        );
        setProjectTodayTaskList(
          response.data?.data.filter(
            item =>
              movement(item.created_at.slice(0, 10)).format('yyyy-MM-DD') ===
              movement().format('yyyy-MM-DD'),
          ),
        );
        setProjectDueTaskList(
          response.data?.data.filter(
            item =>
              movement(item.created_at.slice(0, 10)).format('yyyy-MM-DD') !==
                movement().format('yyyy-MM-DD') &&
              item.task_status === 'Active',
          ),
        );
        setProjectCompleteTaskList(
          response.data?.data.filter(item => item.task_status === 'Completed'),
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }, [data.id, projectTaskListUrl]);

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
      return CommanFunctions.getCompleteTask(task_status, taskId)
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            navigation.navigate('approve', {
              taskStatus: task_status,
            });
            ToastMessage.showMessage(response.data?.message);
          }
        })
        .catch(error => {
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
            setLoading(false);
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
    getProjectsTaskList();
  }, [getProjectsTaskList]);

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
            getProjectsTaskList();
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
            getProjectsTaskList();
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
            getProjectsTaskList();
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
            getProjectsTaskList();
          }}
        />
      </View>
      <Dividers />
      <View>
        {innerSide === 'All' ? (
          projectAllTask.length > 0 ? (
            <ScrollView contentContainerStyle={{
              flexGrow: 1,
            }}>
              {projectAllTask.map((all, index) => (
                <AllTask
                  data={all}
                  key={index}
                  navigation={navigation}
                  iconPress={() => {
                    setData(all);
                    setTaskId(all.id);
                    setProjectId(all.project_id);
                    setTaskStatus(all.task_status);
                    taskOptionsRef.current.show();
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'today' ? (
          projectTodayTask.length > 0 ? (
            <ScrollView>
              {projectTodayTask.map((today, index) => (
                <AllTask
                  data={today}
                  key={index}
                  navigation={navigation}
                  iconPress={() => {
                    setData(today);
                    setTaskId(today.id);
                    setProjectId(today.project_id);
                    setTaskStatus(today.task_status);
                    taskOptionsRef.current.show();
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'due' ? (
          projectsDueTask.length > 0 ? (
            <ScrollView>
              {projectsDueTask.map((due, index) => (
                <AllTask
                  data={due}
                  key={index}
                  navigation={navigation}
                  iconPress={() => {
                    setData(due);
                    setTaskId(due.id);
                    setProjectId(due.project_id);
                    setTaskStatus(due.task_status);
                    taskOptionsRef.current.show();
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )
        ) : innerSide === 'complete' ? (
          projectCompleteTask.length > 0 ? (
            <ScrollView>
              {projectCompleteTask.map((complete, index) => (
                <AllTask
                  data={complete}
                  key={index}
                  navigation={navigation}
                  iconPress={() => {
                    setData(complete);
                    setData(complete);
                    setTaskId(complete.id);
                    setProjectId(complete.project_id);
                    setTaskStatus(complete.task_status);
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
      {/* <View
        style={{
          width: '100%',
        }}>
        {projectAllTask.length > 0 ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            {projectAllTask.map((projectItems, index) =>
              innerSide === 'All' ? (
                projectItems.task_status === 'Active' ? (
                  <TaskTile
                    key={projectItems.title}
                    data={projectItems}
                    index={index}
                    iconPress={() => {
                      setTaskId(data.id);
                      setTaskStatus(data.task_status);
                      taskOptionsRef.current.show();
                    }}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: projectItems,
                      });
                    }}
                  />
                ) : (
                  <View key={index} />
                )
              ) : innerSide === 'today' ? (
                movement(projectItems.actual_deadline).format(
                  'MMM DD, yyyy',
                ) === currentDate && projectItems.task_status === 'Active' ? (
                  <TaskTile
                    key={projectItems.title}
                    data={projectItems}
                    index={index}
                    iconPress={() => {
                      setTaskId(data.id);
                      setTaskStatus(data.task_status);
                      taskOptionsRef.current.show();
                    }}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: projectItems,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : innerSide === 'due' ? (
                movement(projectItems.actual_deadline).format(
                  'MMM DD, yyyy',
                ) !== currentDate && projectItems.task_status === 'Active' ? (
                  <TaskTile
                    key={projectItems.title}
                    data={projectItems}
                    index={index}
                    iconPress={() => {
                      setTaskId(data.id);
                      setTaskStatus(data.task_status);
                      taskOptionsRef.current.show();
                    }}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: projectItems,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : innerSide === 'complete' ? (
                projectItems.task_status === 'Completed' ? (
                  <TaskTile
                    key={projectItems.title}
                    data={projectItems}
                    index={index}
                    iconPress={() => {
                      setTaskId(data.id);
                      setTaskStatus(data.task_status);
                      taskOptionsRef.current.show();
                    }}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: projectItems,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : (
                <View key={projectItems.title}>
                  <Text
                    style={{
                      color: ColorConstants.primaryBlack,
                    }}>
                    {movement(projectItems.actual_deadline).format(
                      'MMM DD, yyyy',
                    )}
                  </Text>
                </View>
              ),
            )}
          </ScrollView>
        ) : (
          <NoData key={data} />
        )}
      </View> */}

      <BottomSheetConditions
        assigneeOptionRef={assigneeOptionRef}
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
        onPressPriority={() => getChangePriority(taskId, checked)}
        onPressReopen={() => {
          getCompleteTask('Reopen');
          reopenOptionRef.current.hide();
        }}
        onValueChange={value => setChecked(value)}
        reopenOptionRef={reopenOptionRef}
        status={taskStatus}
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
    fontFamily: FontConstants.semiBold
  },
  inner_tab_view_style: {
    height: 30,
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});

export default ProjectPageScreen;
