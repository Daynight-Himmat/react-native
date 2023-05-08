/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiConstants, BaseUrl, BaseUrl1} from '../../constants/api_constants';
import {InnerTab, TabContainer} from '../../components/tabs';
import {Loading, NoData} from '../../components/no_data_found';
import TaskTile from '../../components/task_tile';
import movement from 'moment';
import CompleteTask from './task_type/complete_task';
import AllTask from './task_type/all_task';
import BottomSheet from '../../components/bottom_sheet';
import {useScrollHandlers} from 'react-native-actions-sheet';
import TaskOption from '../../components/task_options';
import TaskAlert from '../../components/task_alert';
import AppButton from '../../components/app_button';
import {RadioButton, Checkbox} from 'react-native-paper';
import {Label} from '../../components/label';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontConstants from '../../constants/fonts';
import ToastMessage from '../../components/toast_message';
import TodayTask from './task_type/today_task';

const HomeScreen = ({navigation}) => {
  const [token, setToken] = useState([]);
  const [checked, setChecked] = useState('first');
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState('My Task');
  const [taskId, setTaskId] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [innerSide, setInnerSide] = useState('All');
  const [getTaskData, setTaskData] = useState([]);
  const [getTaskDateData, setTaskDateData] = useState([]);
  const [getAssigneeTaskData, setAssigneeTaskData] = useState([]);
  const taskOptionsRef = useRef(null);
  const deleteOptionRef = useRef(null);
  const reopenOptionRef = useRef(null);
  const completeOptionRef = useRef(null);
  const assigneeOptionRef = useRef(null);
  const changePriorityRef = useRef(null);

  const taskListUrl = BaseUrl1(ApiConstants.myTaskList);
  const taskAssigneeListUrl = BaseUrl1(ApiConstants.taskAssignList);
  const changePriorityUrl = BaseUrl1(ApiConstants.changePriority);
  const completeTaskUrl = BaseUrl1(ApiConstants.changeTaskStatus);
  const deleteTaskUrl = BaseUrl1(ApiConstants.changeTaskDelete);

  const scrollHandlers = useScrollHandlers < ScrollView > ('1', taskOptionsRef);

  var currentDate = new movement().format('MMM DD, yyyy');

  const checking = async ({type}) => {
    try {
      setLoading(true);
      var userId = await AsyncStorage.getItem('user_id');
      var asyncStorageRes = await AsyncStorage.getItem('token');
      axios
        .post(taskListUrl, {
          token: asyncStorageRes,
          id: userId,
          type: type && 'All',
        })
        .then(response => {
          if (response.status === 200) {
            setTaskData(response.data.data?.data);
            var result = response.data.data?.data.reduce((unique, o) => {
              if (
                !unique.some(
                  obj =>
                    obj.created_at.slice(0, 10) === o.created_at.slice(0, 10),
                )
              ) {
                unique.push(o);
              }
              return unique;
            }, []);
            console.log(
              response.data.data?.data.filter(item => item !== 'Completed'),
            );
            setTaskDateData(result);
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
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
          buttonName={'Assigned Task'}
        />
      </View>
      <View style={{padding: 5}} />
      <View
        style={{
          height: 30,
          backgroundColor: ColorConstants.primaryWhite,
          flexDirection: 'row',
          marginTop: 10,
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
            // checking({type: 'All'});
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
            // checking({type: 'today'});
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
            // checking({type: 'due'});
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
            // checking({type: 'Completed'});
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
      {/* {getTaskDateData.length > 0 && (
        <ScrollView>
          {getTaskDateData.map((int, i) => (
            <View key={i}>
              <Text
                style={{
                  color: ColorConstants.primaryBlack,
                  fontSize: 18,
                  fontWeight: '600',
                  fontFamily: FontConstants.semiBold,
                }}>
                {int.created_at.slice(0, 10) === current
                  ? 'Today'
                  : int.created_at.slice(0, 10) === yester
                  ? 'Yesterday'
                  : int.created_at.slice(0, 10)}
              </Text>
              {getTaskData.map((item, inde) =>
                item.task_status === 'Active' &&
                int.created_at.slice(0, 10) === item.created_at.slice(0, 10) ? (
                  <View key={inde}>
                    <TaskTile
                      key={inde}
                      getData={getTaskDateData}
                      data={item}
                      index={inde}
                      onPress={() => {
                        navigation.navigate('task_details_screen', {
                          data: inde,
                        });
                      }}
                    />
                  </View>
                ) : (
                  <View />
                ),
              )}
            </View>
          ))}
        </ScrollView>
      )} */}
      {/* {getTaskData.length > 0 &&
        getTaskData
          .filter(x => x.created_at.slice(0, 10) === current)
          .map((int, i) => (
            <Text
              key={i}
              style={{
                color: ColorConstants.primaryBlack,
                fontSize: 14,
                fontFamily: FontConstants.ragular,
              }}>
              {int.created_at.slice(0, 10) === current ? 'Today' : ''}
            </Text>
          ))} */}
      {loading === false ? (
        side === 'My Task' ? (
          getTaskData.length > 0 ? (
            <ScrollView>
              {getTaskData.map((data, index) =>
                innerSide === 'All' ? (
                  <AllTask
                    key={index}
                    data={data}
                    index={index}
                    navigation={navigation}
                    iconPress={() => {
                      taskOptionsRef.current.show();
                      setTaskId(data.id);
                      setTaskStatus(data.task_status);
                    }}
                  />
                ) : innerSide === 'today' ? (
                  <TodayTask
                    key={index}
                    data={data}
                    index={index}
                    navigation={navigation}
                    iconPress={() => {
                      taskOptionsRef.current.show();
                      setTaskId(data.id);
                      setTaskStatus(data.task_status);
                    }}
                  />
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
                  <CompleteTask
                    key={index}
                    data={data}
                    index={index}
                    navigation={navigation}
                  />
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
        <View />
      )}
      <BottomSheet
        refer={taskOptionsRef}
        backButton={() => taskOptionsRef.current.hide()}
        widget={
          <TaskOption
            status={taskStatus}
            onPressPriority={() => {
              taskOptionsRef.current.hide();
              changePriorityRef.current.show();
            }}
            onPressComplete={() => {
              taskOptionsRef.current.hide();
              completeOptionRef.current.show();
            }}
            onPressDelete={() => {
              taskOptionsRef.current.hide();
              deleteOptionRef.current.show();
            }}
            onPressReopen={() => {
              taskOptionsRef.current.hide();
              reopenOptionRef.current.show();
            }}
          />
        }
      />
      <BottomSheet
        refer={completeOptionRef}
        backButton={() => completeOptionRef.current.hide()}
        widget={
          <TaskAlert
            buttonLabel={'Complete'}
            label={'Are you sure you want to close the task.'}
            onBack={() => completeOptionRef.current.hide()}
            onPress={() => {
              getCompleteTask('Completed');
              completeOptionRef.current.hide();
            }}
          />
        }
      />
      <BottomSheet
        refer={deleteOptionRef}
        backButton={() => deleteOptionRef.current.hide()}
        widget={
          <TaskAlert
            label={'Are you sure you want to delete the task.'}
            buttonLabel={'Delete'}
            style={{backgroundColor: ColorConstants.highLightColor}}
            onBack={() => deleteOptionRef.current.hide()}
            onPress={() => {
              getDeleteTask();
              deleteOptionRef.current.hide();
            }}
          />
        }
      />
      <BottomSheet
        refer={reopenOptionRef}
        backButton={() => reopenOptionRef.current.hide()}
        widget={
          <TaskAlert
            label={'Are you sure you want to Reopen the task.'}
            buttonLabel={'Reopen'}
            onBack={() => reopenOptionRef.current.hide()}
            onPress={() => {
              getCompleteTask('Reopen');
              reopenOptionRef.current.hide();
            }}
          />
        }
      />
      <BottomSheet
        refer={changePriorityRef}
        backButton={() => changePriorityRef.current.hide()}
        widget={
          <View
            style={{
              padding: 10,
              marginBottom: 20,
            }}>
            <View style={styles.radiobuttonContainer}>
              <View>
                <Label name={'Select Priority'} />
              </View>
              <RadioButton.Group
                onValueChange={value => setChecked(value)}
                value={checked}>
                <View style={styles.row}>
                  <RadioButton.Item
                    color={ColorConstants.highLightColor}
                    label="High"
                    value="High"
                    labelStyle={styles.radioLabel}
                  />
                  <RadioButton.Item
                    color={ColorConstants.highLightColor}
                    label="Low"
                    value="Low"
                    labelStyle={styles.radioLabel}
                  />
                </View>
              </RadioButton.Group>
            </View>
            <AppButton
              text={'Change Priority'}
              onPress={() => getChangePriority(taskId, checked)}
            />
          </View>
        }
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
    padding: 10,
    backgroundColor: ColorConstants.primaryWhite,
  },
  tab_container: {
    height: 48,
    width: '100%',
    borderColor: ColorConstants.primaryColor,
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: 'row',
  },
  progress: {
    backgroundColor: 'white',
  },
  containers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scrollview: {
    width: '100%',
    padding: 12,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  radiobuttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  radioLabel: {
    fontFamily: FontConstants.medium,
    fontWeight: '600',
  },
});

export default HomeScreen;
