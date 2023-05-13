import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions 
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Loading, NoData} from '../../components/no_data_found';
import {Label, LightText1} from '../../components/label';
import AppSize from '../../components/size';
import {TimeContainer} from '../../components/person_tile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import {Ionicons, Octicons} from '../../components/icons';
import {Appbar} from 'react-native-paper';
import Comment from '../../../assets/images/comments_icon.svg';
import ToastMessage from '../../components/toast_message';
import movement from 'moment';
import AppButton from '../../components/app_button';
import BottomSheetConditions from '../../components/bottom_sheet_with_condition';
import BottomSheet from '../../components/bottom_sheet';
import TaskAlert from '../../components/task_alert';
import CommanFunctions from '../../components/comman_functions';
import CalenderContainer from '../../components/calender';

const {height, widget} = Dimensions.get('screen'); 

const TaskDetailsScreen = ({navigation, route}) => {
  const {data} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [taskComments, setTaskComments] = useState([]);
  const [comment, setComment] = useState('');
  const commentBox = useRef();
  const completeOptionRef = useRef(null);
  const reopenOptionRef = useRef(null);

  const taskDetailsUrl = BaseUrl(ApiConstants.taskDetails);
  const projectDataUrl = BaseUrl(ApiConstants.myProjectList);
  const taskCommentUrl = BaseUrl(ApiConstants.taskGetComments);
  const commentUrl = BaseUrl(ApiConstants.taskComments);
  const getUserUrl = BaseUrl(ApiConstants.getUserList);
  const getPermissionUrl = BaseUrl(ApiConstants.taskEditPermission);
  const getTaskDeadline = BaseUrl(ApiConstants.revisedTaskDeadline);
  const changePriorityUrl = BaseUrl(ApiConstants.changePriority);
  const completeTaskUrl = BaseUrl(ApiConstants.changeTaskStatus);
  const deleteTaskUrl = BaseUrl(ApiConstants.changeTaskDelete);
  const taskListUrl = BaseUrl(ApiConstants.myTeamTaskList);
  const [modalVisible, setModalVisible] = useState(false);
  const [getDeadline, setTaskDeadline] = useState(
    movement().utcOffset('+05:30').format('YYYY-MM-DD'),
  );
  var currentDate = new movement().format('MMM DD, yyyy');
  var date = movement().utcOffset('+05:30').format('YYYY-MM-DD');

  const getTaskDetails = async () => {
    try {
      setLoading(true);
      var token = await AsyncStorage.getItem('token');
      var userID = await AsyncStorage.getItem('user_id');
      await axios
        .post(taskDetailsUrl, {
          token: token,
          id: data.user_id,
          task_id: data.id,
        })
        .then(response => {
          setTaskDetails(response.data?.data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
        });
      await axios
        .post(projectDataUrl, {
          token: token,
          id: userID,
          task_id: data.id,
        })
        .then(response => {
          setProjectData(response.data?.data?.data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
        });
      await axios
        .post(taskCommentUrl, {
          token: token,
          id: userID,
          task_id: data.id,
        })
        .then(response => {
          setTaskComments(response.data?.data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
        });
      await axios
        .post(getUserUrl, {
          token: token,
        })
        .then(response => {
          if (response.status === 200) {
            setUserData(response.data?.data);
            setLoading(false);
          }
        })
        .catch(error => {
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
          task_id: data.id,
          task_status: task_status,
        })
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            navigation.navigate('approve', {
              taskStatus: task_status,
            });
            getTaskDetails();
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

  const sendComment = async () => {
    setLoading(true);
    var token = await AsyncStorage.getItem('token');
    var userID = await AsyncStorage.getItem('user_id');
    await axios
      .post(commentUrl, {
        token: token,
        user_id: userID,
        task_id: data.id,
        comments: comment,
      })
      .then(response => {
        ToastMessage.showMessage(response.data.message);
        getTaskDetails();
        setComment('');
        commentBox.current.clear();
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const getPermission = async () => {
    try {
      setLoading(true);
      var token = await AsyncStorage.getItem('token');
      var userID = await AsyncStorage.getItem('user_id');
      return await axios
        .post(getPermissionUrl, {
          token: token,
          task_id: data.id,
        })
        .catch(error => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getUpdateDate = async () => {
    try {
      setLoading(true);
      var token = await AsyncStorage.getItem('token');
      var userID = await AsyncStorage.getItem('user_id');
      return await axios
        .post(getTaskDeadline, {
          token: token,
          id: userID,
          task_id: data.id,
          task_deadline: getDeadline,
        })
        .catch(error => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTaskDetails();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header_style}>
        <Appbar.BackAction
          safeAreaInsets={true}
          style={styles.back_button_style}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="" color={ColorConstants.primaryBlack} />
        {taskDetails[0]?.task_status !== 'Completed' && (
          <Appbar.Action
            icon="pencil"
            size={18}
            onPress={() => {
              getPermission().then(response => {
                setLoading(false);
                console.log(response.data);
                if (response.data?.data) {
                  // console.log('get Permission not null', response.data?.data);
                  ToastMessage.showMessage(response.data?.message);
                  navigation.navigate('add_task', {
                    data: response.data?.data,
                    comeFrom: 'update_task',
                  });
                } else {
                  ToastMessage.showMessage(response.data?.message);
                  console.log('get Permission null', response.data?.data);
                }
              });
            }}
          />
        )}
        {taskDetails[0]?.task_status === 'Completed' ? (
          <Appbar.Action
            icon="autorenew"
            size={18}
            color={ColorConstants.primaryBlack}
            onPress={() => {
              reopenOptionRef.current.show();
            }}
            style={{
              marginLeft: -5,
              marginRight: -10,
            }}
          />
        ) : (
          <Appbar.Action
            icon="check"
            size={18}
            color={ColorConstants.primaryBlack}
            onPress={() => {
              completeOptionRef.current.show();
            }}
            style={{
              marginLeft: -5,
              marginRight: -10,
            }}
          />
        )}
      </Appbar.Header>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <CalenderContainer
          date={date}
          deadline={getDeadline}
          onCancal={() => setModalVisible(!modalVisible)}
          onDayPress={day => {
            console.log('selected day', day.dateString);
            setTaskDeadline(day.dateString);
          }}
          onSelect={() => {
            getUpdateDate().then(response => {
              setLoading(false);
              getTaskDetails();
              ToastMessage.showMessage(response.data?.message);
            });
            setModalVisible(!modalVisible);
          }}
        />
      </Modal>
      <View style={styles.scroll_styles}>
        {taskDetails[0]?.task_status === 'Completed' ? (
          <View
            style={{
              width: '100%',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              backgroundColor: ColorConstants.buttonGreenColor,
            }}>
            <Text
              style={{
                fontSize: 17,
                padding: 10,
                fontWeight: '500',
                color: ColorConstants.primaryWhite,
              }}>
              Task Completed
            </Text>
          </View>
        ) : (
          <View />
        )}
        <AppSize height={10} />
        <Label
          name={
            taskDetails[0]?.task_title === '' ? '' : taskDetails[0]?.task_title
          }
        />
        <LightText1
          lightText1={
            taskDetails[0]?.description === ''
              ? ''
              : taskDetails[0]?.description
          }
        />
        <AppSize height={10} />
        <View style={styles.profile_row}>
          <View
            style={[
              styles.profile_view,
              {backgroundColor: ColorConstants.primaryWhite},
            ]}>
            <Octicons
              name={'project'}
              color={ColorConstants.primaryColor}
              size={18}
            />
          </View>

          <AppSize width={10} />
          <View style={styles.column}>
            <Text style={styles.light_label}>Project Name</Text>
            <Label
              name={projectData.map(projectItems =>
                projectItems.id === data.project_id
                  ? projectItems.project_name
                  : '',
              )}
            />
          </View>
        </View>
        <AppSize height={10} />
        <View style={styles.profile_row}>
          <View style={styles.profile_view}>
            <Ionicons
              name={'person-sharp'}
              size={18}
              color={ColorConstants.primaryWhite}
            />
          </View>
          <AppSize width={10} />
          <View style={styles.column}>
            <Text style={styles.light_label}>Created By</Text>
            <Label
              name={
                taskDetails[0]?.name === ''
                  ? 'No Project Found'
                  : taskDetails[0]?.name
              }
            />
          </View>
        </View>
        <AppSize height={10} />
        <View style={styles.time_container_styles}>
          <TimeContainer
            dateLabel={'Actual Date'}
            date={taskDetails[0]?.actual_deadline.slice(0, 10)}
            color={ColorConstants.buttonGreenColor}
            style={{
              borderColor: ColorConstants.buttonGreenColor,
              color: ColorConstants.buttonGreenColor,
            }}
          />
          <AppSize width={5} />

          <TouchableOpacity
            style={styles.flex}
            onPress={() => {
              getPermission().then(response => {
                setLoading(false);
                if (response.data?.data) {
                  console.log('get Permission not null', response.data?.data);
                  setModalVisible(true);
                  ToastMessage.showMessage(response.data?.message);
                } else {
                  ToastMessage.showMessage(response.data?.message);
                  console.log('get Permission null', response.data?.data);
                }
              });
            }}>
            <TimeContainer
              dateLabel={'Deadline'}
              date={taskDetails[0]?.task_deadline.slice(0, 10)}
              color={ColorConstants.highLightColor}
              style={{
                borderColor: ColorConstants.highLightColor,
                color: ColorConstants.highLightColor,
              }}
            />
          </TouchableOpacity>
          <AppSize width={5} />
          <TimeContainer
            dateLabel={'Created Date'}
            date={taskDetails[0]?.created_at.slice(0, 10)}
            color={ColorConstants.primaryBlack}
            style={{
              borderColor: ColorConstants.primaryBlack,
              color: ColorConstants.primaryBlack,
            }}
          />
        </View>
        <AppSize height={10} />
        <Label name={'Task Image'} />
        <TouchableOpacity style={styles.attachment}>
          <Ionicons
            name={'add'}
            color={ColorConstants.textHintColor}
            size={18}
          />
        </TouchableOpacity>
        <AppSize height={10} />
        <View style={styles.task_assignee}>
          <View style={styles.task_assignee_row}>
            <View style={styles.task_assignee_container}>
              <View style={styles.task_assignee_container_column}>
                <Text style={styles.task_assignee_text}>Task Assignee</Text>
              </View>
              <View style={styles.counter_container}>
                <Text style={styles.counter_text}>
                  {taskDetails[0]?.assined_ids !== ''
                    ? taskDetails[0]?.assined_ids.replaceAll(',', '').length
                    : ''}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.task_assignee_container,
                {
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 0,
                },
              ]}>
              <View style={styles.task_assignee_container_column}>
                <Text style={styles.task_assignee_text}>Project Assignee</Text>
              </View>
              <View style={styles.counter_container}>
                <Text style={styles.counter_text}>
                  {projectData.map(projectItems =>
                    projectItems.id === data.project_id
                      ? projectItems.project_cordinator_id.replaceAll(',', '')
                          .length
                      : '',
                  )}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.comment_scroll_container}>
            {taskComments.length > 0 ? (
              <ScrollView contentContainerStyle={styles.comment_scroll}>
                {taskComments.map((data, index) => {
                  return (
                    <View key={index} style={styles.comment_row}>
                      <View style={styles.commect_time_container}>
                        <Text
                          style={{
                            color: ColorConstants.textLightBlack1,
                          }}>
                          {data.created_at}
                        </Text>
                        <View style={styles.profile_row}>
                          <View
                            style={[
                              styles.profile_view,
                              {width: 18, height: 18},
                            ]}>
                            <Ionicons
                              name={'person-sharp'}
                              size={8}
                              color={ColorConstants.primaryWhite}
                            />
                          </View>
                          <AppSize width={10} />
                          <View style={styles.column}>
                            <Label
                              name={userData.map(user =>
                                user.id === data.user_id ? user.name : '',
                              )}
                            />
                          </View>
                        </View>
                        <View style={styles.profile_row}>
                          <Comment />
                          <AppSize width={10} />
                          <View style={styles.column}>
                            <Text style={styles.comment_text}>
                              {data.comments}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <NoData />
            )}
          </View>

          <AppSize height={10} />
        </View>
        {/* <AppSize height={121} /> */}
      </View>
      <View style={styles.bottom_container}>
        <View style={styles.text_input_container}>
          <TextInput
            style={styles.flex}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="comment"
            placeholderTextColor={ColorConstants.textLightBlack1}
            multiline={true}
            ref={commentBox}
            numberOfLines={4}
            color={ColorConstants.primaryBlack}
            onChangeText={text => {
              setComment(text);
            }}
          />
          <TouchableOpacity>
            <Ionicons
              name={'attach'}
              color={ColorConstants.textLightBlack1}
              size={24}
            />
          </TouchableOpacity>
          <AppSize width={10} />
          <TouchableOpacity
            onPress={() => {
              comment !== ''
                ? sendComment()
                : ToastMessage.showMessage('Please enter your comment');
            }}>
            <Ionicons
              name={'send-sharp'}
              color={ColorConstants.textLightBlack1}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
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
            }}
          />
        }
      />

      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header_style: {
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
  },
  back_button_style: {
    position: 'relative',
    left: -10,
  },
  scroll_styles: {
   paddingHorizontal: 10,
  },
  row: {flexDirection: 'row'},
  column: {flexDirection: 'column'},
  light_label: {
    fontWeight: '500',
    color: ColorConstants.textHintColor,
  },
  profile_row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profile_view: {
    backgroundColor: ColorConstants.textHintColor,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: 35,
    height: 35,
  },
  container: {
    
    height: height,
    width: widget,
    // width: '100%',
    justifyContent: 'flex-start',
    // paddingHorizontal: 10,
    backgroundColor: ColorConstants.primaryWhite,
  },
  time_container_styles: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time_Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date_label: {
    fontWeight: '500',
    color: ColorConstants.primaryBlack,
  },
  date_container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: ColorConstants.primaryColor,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 7,
  },
  date_text: {
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.primaryBlack,
  },
  bottom_container: {
    width: '100%',
    position: 'absolute',
    bottom: 30,
    // left: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: ColorConstants.primaryWhite,
  },
  text_input_container: {
    height: 48,
    width: '100%',
    borderColor: ColorConstants.textLightBlack1,
    backgroundColor: ColorConstants.primaryWhite,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  task_assignee: {
    width: '100%',
    backgroundColor: ColorConstants.commentContainer,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-start',
    borderRadius: 5,
  },
  task_assignee_row: {
    flexDirection: 'row',
    backgroundColor: ColorConstants.primaryWhite,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  task_assignee_container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ColorConstants.primaryColor,
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 10,
    borderTopLeftRadius: 5,
  },
  task_assignee_container_column: {
    flexDirection: 'column',
    backgroundColor: ColorConstants.primaryColor,
    paddingVertical: 10,
  },
  task_assignee_text: {
    color: ColorConstants.primaryWhite,
    fontWeight: '500',
  },
  counter_container: {
    height: 30,
    width: 30,
    backgroundColor: ColorConstants.commentContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  counter_text: {
    color: ColorConstants.primaryBlack,
    fontWeight: '400',
  },
  comment_scroll_container: {
    width: '100%',
    height: 150,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  comment_scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  comment_row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  commect_time_container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
  },
  comment_text: {
    fontSize: 12,
    color: ColorConstants.textDarkBlack,
  },
  attachment: {
    height: 45,
    width: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderStyle: 'dotted',
    borderColor: ColorConstants.textLightBlack1,
    backgroundColor: ColorConstants.primaryWhite,
  },
});

export default TaskDetailsScreen;
