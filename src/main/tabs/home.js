/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import {InnerTab, TabContainer} from '../../components/tabs';
import {Loading, NoData} from '../../components/no_data_found';
import FontConstants from '../../constants/fonts';
import toastMessage from '../../components/toast_message';
import Dividers from '../../components/divider';
import BottomSheetConditions from '../../components/bottom_sheet_with_condition';
import {useFocusEffect} from '@react-navigation/native';
import {Feather, Ionicons} from '../../components/icons';
import Notification from '../../assets/images/notification.svg';
import SearchIcon from '../../assets/images/search.svg';
import AppSize from '../../components/size';
import {Label} from '../../components/label';
import {Appbar} from 'react-native-paper';
import TaskTile from '../../components/task_tile';
import Condition from '../../components/conditions';
import ColorsCondtion from '../../components/color_condition';
import {useToast} from 'react-native-toast-notifications';
import TimeCondition from '../../components/time_condition';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

const HomeScreen = ({navigation}) => {
  const toast = useToast();
  const [checked, setChecked] = useState('High');
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState(false);
  const [userId, setUserId] = useState('');
  const [get_user, setUserData] = useState('');
  const [innerSide, setInnerSide] = useState('All');
  const [getAddData, setAllData] = useState([]);
  const [getTodayData, setTodayData] = useState([]);
  const [getDueData, setDueData] = useState([]);
  const [getCompleted, setCompleteData] = useState([]);
  const [getBottomData, setData] = useState([]);
  const [getAssigneeAddData, setAllAssigneeData] = useState([]);
  const [getAssigneeTodayData, setTodayAssigneeData] = useState([]);
  const [getAssigneeDueData, setDueAssigneeData] = useState([]);
  const [getAssigneeCompleted, setCompleteAssigneeData] = useState([]);
  const taskOptionsRef = useRef(null);
  const deleteOptionRef = useRef(null);
  const reopenOptionRef = useRef(null);
  const completeOptionRef = useRef(null);
  const assigneeOptionRef = useRef(null);
  const changePriorityRef = useRef(null);
  const selectAssigneeRef = useRef(null);
  const selectApprovedRef = useRef(null);
  const [assignee, setAssignee] = useState([]);
  const [searchUser, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [getSearchAssingee, setSearchAssignee] = useState([]);
  const url1 = BaseUrl(ApiConstants.projectWiseMember);
  const changeAssigneeUrl = BaseUrl(ApiConstants.changeTaskAssignee);
  const url = BaseUrl(ApiConstants.getUser);
  const taskListUrl = BaseUrl(ApiConstants.myTaskList);
  const taskAssigneeListUrl = BaseUrl(ApiConstants.taskAssignList);
  const changePriorityUrl = BaseUrl(ApiConstants.changePriority);
  const completeTaskUrl = BaseUrl(ApiConstants.changeTaskStatus);
  const deleteTaskUrl = BaseUrl(ApiConstants.changeTaskDelete);

  const checking = async () => {
    try {
      setLoading(true);
      var asyncStorageRes = await AsyncStorage.getItem('token');
      await axios
        .post(url, {
          token: asyncStorageRes,
        })
        .then(response => {
          if (response.status === 200) {
            setUserData(response.data?.user);
            AsyncStorage.setItem('user_id', `${response.data?.user.id}`);
            setUserId(response.data?.user.id);
            taskData(response.data?.user.id);
          }
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const taskData = async id => {
    try {
      setLoading(true);
      var asyncStorageRes = await AsyncStorage.getItem('token');
      await axios
        .post(taskListUrl, {
          token: asyncStorageRes,
          id: id,
        })
        .then(response => {
          if (response.status === 200) {
            setAllData(
              response.data.data?.data.filter(item =>
                Condition.activeAndReopen(item.task_status),
              ),
            );
            setTodayData(
              response.data.data?.data.filter(item =>
                TimeCondition.todayDateCheck(item.created_at.slice(0, 10)),
              ),
            );
            setDueData(
              response.data.data?.data.filter(
                item =>
                  TimeCondition.dueDateCheck(item.created_at.slice(0, 10)) &&
                  Condition.activeAndReopen(item.task_status),
              ),
            );
            setCompleteData(
              response.data.data?.data.filter(item =>
                Condition.StatusCondition(item.task_status),
              ),
            );
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });

      await axios
        .post(taskAssigneeListUrl, {
          token: asyncStorageRes,
          id: id,
        })
        .then(response => {
          if (response.status === 200) {
            setAllAssigneeData(
              response.data.data?.data.filter(item =>
                Condition.activeAndReopen(item.task_status),
              ),
            );
            setTodayAssigneeData(
              response.data.data?.data.filter(item =>
                TimeCondition.todayDateCheck(item.created_at.slice(0, 10)),
              ),
            );
            setDueAssigneeData(
              response.data.data?.data.filter(
                item =>
                  TimeCondition.dueDateCheck(item.created_at.slice(0, 10)) &&
                  Condition.activeAndReopen(item.task_status),
              ),
            );
            setCompleteAssigneeData(
              response.data.data?.data.filter(item =>
                Condition.StatusCondition(item.task_status),
              ),
            );

            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
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
          task_id: getBottomData.id,
          task_status: task_status,
        })
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            checking({type: 'All'});
            navigation.navigate('approve', {
              taskStatus: task_status,
            });
            toastMessage(toast, response.data?.message);
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
            toastMessage(toast, response.data?.message);
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
          task_id: getBottomData.id,
        })
        .then(response => {
          if (response.status === 200) {
            console.log(response.data?.message);
            setLoading(false);
            checking({type: 'All'});
            navigation.navigate('approve', {
              taskStatus: 'Delete',
            });
            toastMessage(toast, response.data?.message);
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

  const PushNotificationUser = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('Push Notification:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('onNotification:', notification);
        // navigation.navigate('Notification');
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('onAction:', notification);
      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,

      requestPermissions: true,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      checking();
      PushNotificationUser();
      taskData(userId);
    }, []),
  );

  const onRefresh = React.useCallback(() => {
    // setLoading(true);
    checking();
    taskData(userId);
  }, []);

  return (
    <View>
      <Appbar.Header
        style={{backgroundColor: ColorConstants.primaryWhite}}
        children={
          <View style={styles.iconList}>
            <View style={{flex: 1}}>
              <Label
                name={`Hi ${get_user.name ?? ''}`}
                style={styles.app_bar_title}
              />
            </View>
            {get_user.role_id === 1 ? (
              <TouchableOpacity onPress={() => {}}>
                <Feather name={'mail'} color={'black'} size={20} />
              </TouchableOpacity>
            ) : (
              <View />
            )}
            <AppSize width={15} />
            <Feather name={'download'} color={'black'} size={20} />
            <AppSize width={15} />
            <TouchableOpacity onPress={() => navigation.navigate('search')}>
              <SearchIcon height={20} width={20} />
            </TouchableOpacity>
            <AppSize width={15} />
            <TouchableOpacity
              onPress={() => navigation.navigate('notification')}>
              <Notification height={20} width={20} />
            </TouchableOpacity>
            <AppSize width={15} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('my_account', {
                  data: get_user,
                });
              }}>
              <View style={styles.imageContainer}>
                {get_user.profile_image != null &&
                get_user.profile_image.split('.').pop() === 'jpg' ? (
                  <Image
                    style={styles.imageContainer}
                    source={{uri: get_user.profile_image}}
                  />
                ) : (
                  <Ionicons
                    name={'person-sharp'}
                    size={10}
                    style={styles.image}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        }
      />
      <View style={styles.container}>
        <View style={styles.tab_container}>
          <TabContainer
            condition={
              !side ? ColorConstants.primaryColor : ColorConstants.primaryWhite
            }
            textCondition={
              side ? ColorConstants.primaryColor : ColorConstants.primaryWhite
            }
            onPress={() => {
              setSide(false);
              taskData(userId);
            }}
            buttonName={'My Task'}
          />
          <TabContainer
            condition={
              !side ? ColorConstants.primaryWhite : ColorConstants.primaryColor
            }
            textCondition={
              side ? ColorConstants.primaryWhite : ColorConstants.primaryColor
            }
            onPress={() => {
              setSide(true);
              taskData(userId);
            }}
            buttonName={'Assigned Task'}
          />
        </View>
        <View
          style={{
            height: 30,
            backgroundColor: ColorConstants.primaryWhite,
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <InnerTab
            tabText={'All'}
            condition={ColorsCondtion.condition(innerSide, 'All')}
            textCondition={ColorsCondtion.textCondition(innerSide, 'All')}
            onPress={() => {
              setInnerSide('All');
              taskData(userId);
            }}
          />

          <InnerTab
            tabText={'Today'}
            condition={ColorsCondtion.condition(innerSide, 'today')}
            textCondition={ColorsCondtion.textCondition(innerSide, 'today')}
            onPress={() => {
              setInnerSide('today');
              taskData(userId);
            }}
          />

          <InnerTab
            tabText={'Due'}
            condition={ColorsCondtion.condition(innerSide, 'due')}
            textCondition={ColorsCondtion.textCondition(innerSide, 'due')}
            onPress={() => {
              setInnerSide('due');
              taskData(userId);
            }}
          />

          <InnerTab
            tabText={'Completed'}
            condition={ColorsCondtion.condition(innerSide, 'complete')}
            textCondition={ColorsCondtion.textCondition(innerSide, 'complete')}
            onPress={() => {
              setInnerSide('complete');
              taskData(userId);
            }}
          />
        </View>
        <Dividers />
        {!loading && (
          <View style={{flex: 1}}>
            {side === false ? (
              innerSide === 'All' ? (
                getAddData.length > 0 ? (
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                      />
                    }>
                    {getAddData.map((data, index) => (
                      <TaskTile
                        index={index}
                        data={data}
                        key={index}
                        navigation={() => {
                          navigation.navigate('task_details_screen', {
                            data: data,
                          });
                        }}
                        iconPress={() => {
                          setData(data);
                          taskOptionsRef.current.show();
                        }}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <NoData />
                )
              ) : innerSide === 'today' ? (
                getTodayData.length > 0 ? (
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                      />
                    }>
                    {getTodayData.map((data, index) => (
                      <TaskTile
                        index={index}
                        data={data}
                        key={index}
                        navigation={() => {
                          navigation.navigate('task_details_screen', {
                            data: data,
                          });
                        }}
                        iconPress={() => {
                          setData(data);
                          taskOptionsRef.current.show();
                        }}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <NoData />
                )
              ) : innerSide === 'due' ? (
                getDueData.length > 0 ? (
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                      />
                    }>
                    {getDueData.map((data, index) => (
                      <TaskTile
                        index={index}
                        data={data}
                        key={index}
                        navigation={() => {
                          navigation.navigate('task_details_screen', {
                            data: data,
                          });
                        }}
                        iconPress={() => {
                          setData(data);
                          taskOptionsRef.current.show();
                        }}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <NoData />
                )
              ) : innerSide === 'complete' ? (
                getCompleted.length > 0 ? (
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                      />
                    }>
                    {getCompleted.map((data, index) => (
                      <TaskTile
                        index={index}
                        data={data}
                        key={index}
                        navigation={() => {
                          navigation.navigate('task_details_screen', {
                            data: data,
                          });
                        }}
                        iconPress={() => {
                          setData(data);
                          Condition.Completed(data.task_status) &&
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
              )
            ) : innerSide === 'All' ? (
              getAssigneeAddData.length > 0 ? (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={loading}
                      onRefresh={onRefresh}
                    />
                  }>
                  {getAssigneeAddData.map((data, index) => (
                    <TaskTile
                      index={index}
                      data={data}
                      key={index}
                      navigation={() => {
                        navigation.navigate('task_details_screen', {
                          data: data,
                        });
                      }}
                      iconPress={() => {
                        setData(data);
                        taskOptionsRef.current.show();
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <NoData />
              )
            ) : innerSide === 'today' ? (
              getAssigneeTodayData.length > 0 ? (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={loading}
                      onRefresh={onRefresh}
                    />
                  }>
                  {getAssigneeTodayData.map((data, index) => (
                    <TaskTile
                      index={index}
                      data={data}
                      key={index}
                      navigation={() => {
                        navigation.navigate('task_details_screen', {
                          data: data,
                        });
                      }}
                      iconPress={() => {
                        setData(data);
                        taskOptionsRef.current.show();
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <NoData />
              )
            ) : innerSide === 'due' ? (
              getAssigneeDueData.length > 0 ? (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={loading}
                      onRefresh={onRefresh}
                    />
                  }>
                  {getAssigneeDueData.map((data, index) => (
                    <TaskTile
                      index={index}
                      data={data}
                      key={index}
                      navigation={() => {
                        navigation.navigate('task_details_screen', {
                          data: data,
                        });
                      }}
                      iconPress={() => {
                        setData(data);
                        taskOptionsRef.current.show();
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <NoData />
              )
            ) : innerSide === 'complete' ? (
              getAssigneeCompleted.length > 0 ? (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={loading}
                      onRefresh={onRefresh}
                    />
                  }>
                  {getAssigneeCompleted.map((data, index) => (
                    <TaskTile
                      index={index}
                      data={data}
                      key={index}
                      navigation={() => {
                        navigation.navigate('task_details_screen', {
                          data: data,
                        });
                      }}
                      iconPress={() => {
                        setData(data);
                        Condition.Completed(data.task_status) &&
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
        )}
        <BottomSheetConditions
          taskData={getBottomData}
          assigneeOptionRef={assigneeOptionRef}
          bottomSheetRef={taskOptionsRef}
          changePriorityRef={changePriorityRef}
          checked={checked}
          completeOptionRef={completeOptionRef}
          approveTaskRef={selectApprovedRef}
          deleteOptionRef={deleteOptionRef}
          selectAssigneeRef={selectAssigneeRef}
          project_id={getBottomData.project_id}
          onPressApproved={() => {
            getCompleteTask('Approved');
            taskOptionsRef.current.hide();
            selectApprovedRef.current.hide();
          }}
          onPressComplete={() => {
            taskOptionsRef.current.hide();
            getCompleteTask('Completed');
            completeOptionRef.current.hide();
          }}
          onPressDelete={() => {
            console.log(getBottomData.id);
            getDeleteTask();
            taskOptionsRef.current.hide();
            deleteOptionRef.current.hide();
          }}
          onPressPriority={() => {
            taskOptionsRef.current.hide();
            getChangePriority(getBottomData.id, checked);
          }}
          onPressReopen={() => {
            getCompleteTask('Reopen');
            taskOptionsRef.current.hide();
            reopenOptionRef.current.hide();
          }}
          onValueChange={value => {
            setChecked(value);
            console.log(value);
          }}
          reopenOptionRef={reopenOptionRef}
          status={getBottomData.task_status}
          navigation={navigation}
        />
      </View>
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 10,
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
  iconList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: '100%',
    paddingHorizontal: 10,
  },
  imageContainer: {
    height: 24,
    width: 24,
    borderRadius: 100,
    backgroundColor: ColorConstants.textHintColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  app_bar_title: {
    fontWeight: '600',
    fontSize: 17,
    fontFamily: FontConstants.semiBold,
  },
});

export default HomeScreen;
