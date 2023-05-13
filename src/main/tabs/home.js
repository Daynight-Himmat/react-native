/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
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
import {useFocusEffect} from '@react-navigation/native';
import {Feather, Ionicons} from '../../components/icons';
import Notification from '../../assets/images/notification.svg';
import SearchIcon from '../../assets/images/search.svg';
import AppSize from '../../components/size';
import {Label} from '../../components/label';
import { Appbar } from 'react-native-paper';
const {height, width} = Dimensions.get('screen');

const HomeScreen = ({navigation}) => {
  const [checked, setChecked] = useState('High');
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState(false);
  const [userId, setUserId] = useState('');
  const [taskId, setTaskId] = useState('');
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
  const [checkedItems, setCheckedItems] = useState([]);
  const [getSearchAssingee, setSearchAssignee] = useState([]);
  const url1 = BaseUrl(ApiConstants.projectWiseMember);
  const changeAssigneeUrl = BaseUrl(ApiConstants.changeTaskAssignee);
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

  const getAssignee = async projectId => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(url1, {
        token: token,
        project_id: projectId,
      });
      setSearchAssignee(response.data?.data);
      setAssignee(response.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const updateAssignee = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(changeAssigneeUrl, {
        token: token,
        id: taskData.user_id,
        task_id: taskData.id,
        assined_ids: '',
        new_assignee: searchUser.map(item => item.id).toString(),
      });
      if (response.status === 200) {
        ToastMessage.showMessage(response.data?.message);
        assigneeOptionRef.current.hide();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = text => {
    if (text === '') {
      setAssignee(getSearchAssingee);
    } else {
      const filtered = getSearchAssingee.filter(item => {
        return item.name?.toLowerCase().includes(text.toLowerCase());
      });
      setAssignee(filtered);
      setSearchQuery(text);
    }
  };

  const handleRemove = id => {
    const remove = searchUser.filter(data => data.id !== id);
    setSearchData(remove);
  };

  useFocusEffect(
    React.useCallback(() => {
      checking();
      taskData(userId);
    }, [url]),
  );

  return (
    
      <View style={styles.container}>
        <Appbar.Header children={ <View style={styles.iconList}>
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
        </View>} />
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
          <View style={{flex:1}}>
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
        {/* <BottomSheet
        refer={taskOptionsRef}
        nextReff={changePriorityRef}
        backButton={() => taskOptionsRef.current.hide()}
        widget={
          <TaskOption
            status={getBottomData.task_status}
            onPressPriority={() => {
              changePriorityRef.current.show();
            }}
            onPressComplete={() => {
              // taskOptionsRef.current.hide();
              completeOptionRef.current.show();
            }}
            onPressDelete={() => {
              // taskOptionsRef.current.hide();
              deleteOptionRef.current.show();
            }}
            onPressReopen={() => {
              // taskOptionsRef.current.hide();
              reopenOptionRef.current.show();
            }}
            onPressChangeAssignee={() => {
              // taskOptionsRef.current.hide();
              assigneeOptionRef.current.show();
            }}
            onPressApproved={() => {
              // taskOptionsRef.current.hide();
              approveTaskRef.current.show();
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
              selectApprovedRef.current.hide();
            }}
          />
        }
      />

      <BottomSheet
        refer={selectApprovedRef}
        backButton={() => selectApprovedRef.current.hide()}
        widget={
          <TaskAlert
            buttonLabel={'Approve'}
            label={'Are you sure you want to Approved the task.'}
            onBack={() => selectApprovedRef.current.hide()}
            onPress={() => {
              getCompleteTask('Approved');
              selectApprovedRef.current.hide();
            }}
          />
        }
      />

      <BottomSheet
        refer={assigneeOptionRef}
        backButton={() => assigneeOptionRef.current.hide()}
        widget={
          <View>
            <Label name={'Assignee'} />
            <View
              style={{
                flexDirection: 'column',
              }}>
              {assignee.length > 0 && searchUser.length > 0 ? (
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingVertical: 10,
                  }}>
                  {searchUser.length > 0 ? (
                    searchUser.map((userid, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View style={styles.assigneeChip}>
                          <TouchableOpacity
                            onPress={() => {
                              handleRemove(userid.id);
                              checkedItems[userid.id] = false;
                              console.log(searchUser);
                            }}
                            style={styles.cancelButton}>
                            <MaterialIcons
                              name={'clear'}
                              color={ColorConstants.primaryWhite}
                              size={12}
                            />
                          </TouchableOpacity>
                          <Text style={styles.chipText}>{userid.name}</Text>
                        </View>
                        <AppSize width={10} />
                      </View>
                    ))
                  ) : (
                    <View />
                  )}
                </ScrollView>
              ) : (
                <View style={{flex: 1, flexDirection: 'column'}} />
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                getAssignee(project_id);
                selectAssigneeRef.current.show();
              }}
              style={styles.add}>
              <Text style={styles.add_text}>+ Add</Text>
            </TouchableOpacity>
            <View style={{paddingVertical: 10}}>
              <RowButton
                onPress={() => {
                  if (searchUser.length === 0) {
                    ToastMessage.showMessage('Please Select Assignee First');
                  } else {
                    updateAssignee();
                  }
                }}
                onback={() => {
                  assigneeOptionRef.current.hide();
                }}
                text={'Select'}
              />
            </View>
          </View>
        }
      />

      <BottomSheet
        refer={selectAssigneeRef}
        backButton={() => selectAssigneeRef.current.hide()}
        widget={
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              paddingHorizontal: 10,
              backgroundColor: ColorConstants.primaryWhite,
            }}>
            <SearchBox
              onChangeText={handleSearch}
              onPress={() => {
                handleSearch(searchQuery);
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
              }}>
              {assignee.length > 0 ? (
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingVertical: 10,
                  }}>
                  {assignee.map((data, index) => (
                    <View
                      key={index}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Checkbox.Item
                        label={data.name}
                        labelStyle={{
                          width: '90%',
                        }}
                        status={
                          selectUser.length > 0
                            ? searchUser.map(e => e === data.id) ===
                              checkedItems[data.id]
                              ? 'checked'
                              : 'unchecked'
                            : checkedItems[data.id]
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => {
                          setCheckedItems({
                            ...checkedItems,
                            [data.id]: !checkedItems[data.id],
                          });
                          if (!checkedItems[data.id]) {
                            searchUser.push({id: data.id, name: data.name});
                            setSearchData(searchUser);
                          } else {
                            searchUser.pop({id: data.id, name: data.name});
                            setSearchData(searchUser);
                          }
                          console.log(checkedItems);
                        }}
                      />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={{height: 200, flexDirection: 'column'}}>
                  <NoData />
                </View>
              )}
            </View>
            <View
              style={{
                paddingVertical: 10,
              }}>
              <RowButton
                onPress={() => {
                  selectAssigneeRef.current.hide();
                }}
                onback={() => {
                  selectAssigneeRef.current.hide();
                }}
                text={'Done'}
              />
            </View>
          </View>
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
              selectApprovedRef.current.hide();
            }}
          />
        }
      />
      <BottomSheet
        refer={changePriorityRef}
        backButton={() => changePriorityRef.current.hide()}
        widget={
          <View style={styles.radioContainerSyle}>
            <View style={styles.radiobuttonContainer}>
              <View>
                <Label name={'Select Priority'} />
              </View>
              <RadioButton.Group onValueChange={value => setChecked(value)} value={checked}>
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
            <AppButton text={'Change Priority'} onPress={()=> getChangePriority(checked)} />
          </View>
        }
      /> */}
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
