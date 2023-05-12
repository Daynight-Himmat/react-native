/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiConstants, BaseUrl, BaseUrl1} from '../../constants/api_constants';
import {InnerTab, TabContainer} from '../../components/tabs';
import {Loading, NoData} from '../../components/no_data_found';
import movement from 'moment';
import CompleteTask from './task_type/complete_task';
import AllTask from './task_type/all_task';
import FontConstants from '../../constants/fonts';
import ToastMessage from '../../components/toast_message';
import Dividers from '../../components/divider';
import BottomSheetConditions from '../../components/bottom_sheet_with_condition';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {Feather, Ionicons} from '../../components/icons';
import Notification from '../../assets/images/notification.svg';
import SearchIcon from '../../assets/images/search.svg';
import AppSize from '../../components/size';
import {Label} from '../../components/label';

const HomeScreen = ({navigation}) => {
  const [checked, setChecked] = useState('High');
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState(false);
  const [userId, setUserId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [get_user, setUserData] = useState('');
  const [projectId, setProjectId] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
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
  const url = BaseUrl(ApiConstants.getUser);
  const taskListUrl = BaseUrl(ApiConstants.myTaskList);
  const taskAssigneeListUrl = BaseUrl(ApiConstants.taskAssignList);
  const changePriorityUrl = BaseUrl(ApiConstants.changePriority);
  const completeTaskUrl = BaseUrl(ApiConstants.changeTaskStatus);
  const deleteTaskUrl = BaseUrl1(ApiConstants.changeTaskDelete);

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
      var asyncStorageRes = await AsyncStorage.getItem('token');
      await axios
        .post(taskListUrl, {
          token: asyncStorageRes,
          id: id,
        })
        .then(response => {
          if (response.status === 200) {
            setAllData(
              response.data.data?.data.filter(
                item =>
                  item.task_status === 'Active' ||
                  item.task_status === 'Reopen',
              ),
            );
            setTodayData(
              response.data.data?.data.filter(
                item =>
                  movement(item.created_at.slice(0, 10)).format(
                    'yyyy-MM-DD',
                  ) === movement().format('yyyy-MM-DD'),
              ),
            );
            setDueData(
              response.data.data?.data.filter(
                item =>
                  movement(item.created_at.slice(0, 10)).format(
                    'yyyy-MM-DD',
                  ) !== movement().format('yyyy-MM-DD') &&
                  item.task_status !== 'Completed',
              ),
            );
            setCompleteData(
              response.data.data?.data.filter(
                item =>
                  item.task_status === 'Completed' ||
                  item.task_status === 'Approved',
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
              response.data.data?.data.filter(
                item =>
                  item.task_status === 'Active' ||
                  item.task_status === 'Reopen',
              ),
            );
            setTodayAssigneeData(
              response.data.data?.data.filter(
                item =>
                  movement(item.created_at.slice(0, 10)).format(
                    'yyyy-MM-DD',
                  ) === movement().format('yyyy-MM-DD'),
              ),
            );
            setDueAssigneeData(
              response.data.data?.data.filter(
                item =>
                  movement(item.created_at.slice(0, 10)).format(
                    'yyyy-MM-DD',
                  ) !== movement().format('yyyy-MM-DD') &&
                  item.task_status !== 'Completed',
              ),
            );
            setCompleteAssigneeData(
              response.data.data?.data.filter(
                item =>
                  item.task_status === 'Completed' ||
                  item.task_status === 'Approved',
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

  useFocusEffect(
    React.useCallback(() => {
      checking();
      taskData(userId);
    }, [url]),
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.iconList}>
          <View style={{flex: 1}}>
            <Label name={`Hi ${get_user.name}`} style={styles.app_bar_title} />
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
          <TouchableOpacity onPress={() => navigation.navigate('notification')}>
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
              taskData(userId);
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
              taskData(userId);
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
              taskData(userId);
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
                  <ScrollView>
                    {getAddData.map((data, index) => (
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
                getTodayData.length > 0 ? (
                  <ScrollView>
                    {getTodayData.map((data, index) => (
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
                getDueData.length > 0 ? (
                  <ScrollView>
                    {getDueData.map((data, index) => (
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
                getCompleted.length > 0 ? (
                  <ScrollView>
                    {getCompleted.map((data, index) => (
                      <CompleteTask
                        data={data}
                        key={index}
                        navigation={navigation}
                        iconPress={() => {
                          setData(data);
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
              )
            ) : innerSide === 'All' ? (
              getAssigneeAddData.length > 0 ? (
                <ScrollView>
                  {getAssigneeAddData.map((data, index) => (
                    <AllTask
                      data={data}
                      key={index}
                      navigation={navigation}
                      iconPress={() => {
                        setData(data);
                        setTaskId(data.id);
                        setTaskStatus(data.task_status);
                        setProjectId(data.project_id);
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
                <ScrollView>
                  {getAssigneeTodayData.map((data, index) => (
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
              getAssigneeDueData.length > 0 ? (
                <ScrollView>
                  {getAssigneeDueData.map((data, index) => (
                    <AllTask
                      data={data}
                      key={index}
                      navigation={navigation}
                      iconPress={() => {
                        setData(data);
                        setTaskId(data.id);
                        setTaskStatus(data.task_status);
                        setProjectId(data.project_id);
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
                <ScrollView>
                  {getAssigneeCompleted.map((data, index) => (
                    <CompleteTask
                      data={data}
                      key={index}
                      navigation={navigation}
                      iconPress={() => {
                        setData(data);
                        setTaskId(data.id);
                        setTaskStatus(data.task_status);
                        setProjectId(data.project_id);
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
          project_id={projectId}
          onPressApproved={() => {
            getCompleteTask('Approved');
            selectApprovedRef.current.hide();
          }}
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
        {loading && <Loading />}
      </View>
    </SafeAreaView>
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
  iconList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
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
