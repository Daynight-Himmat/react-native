import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  RefreshControl,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Loading, NoData} from '../../components/no_data_found';
import {Label, LightText1} from '../../components/label';
import AppSize from '../../components/size';
import {TimeContainer} from '../../components/person_tile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  ApiConstants,
  BaseUrl,
  BaseUrl1,
  TaskChatImage,
  TaskIssueImage,
  TaskImage,
} from '../../constants/api_constants';
import {Ionicons, Octicons} from '../../components/icons';
import {Appbar} from 'react-native-paper';
import {Avatar} from '@rneui/themed';
import Comment from '../../../assets/images/comments_icon.svg';
import toastMessage from '../../components/toast_message';
import movement from 'moment';
import BottomSheet from '../../components/bottom_sheet';
import TaskAlert from '../../components/task_alert';
import CalenderContainer from '../../components/calender';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useToast} from 'react-native-toast-notifications';
import Condition from '../../components/conditions';
import TimeCondition from '../../components/time_condition';
import Counter from '../../components/counter';

const {height, widget} = Dimensions.get('window');

const TaskDetailsScreen = ({navigation, route}) => {
  const toast = useToast();
  const {data} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [taskComments, setTaskComments] = useState([]);
  const [taskIssueImages, getTaskIssueImages] = useState([]);
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
  const completeTaskUrl = BaseUrl(ApiConstants.changeTaskStatus);
  const taskIssueImageUrl = BaseUrl(ApiConstants.taskImageIssue);
  const getTaskIssueImageUrl = BaseUrl(ApiConstants.taskGetIssues);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, updateImage] = useState();
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
      getTaskIssueImage();
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
  

  const sendComment = async () => {
    setLoading(true);
    var token = await AsyncStorage.getItem('token');
    var userID = await AsyncStorage.getItem('user_id');
    const formData = new FormData();
    formData.append('token', token);
    formData.append('user_id', userID);
    formData.append('task_id', data.id);
    formData.append('comments', comment);
    imageUri === ''
      ? formData.append('images', '')
      : formData.append('images', {
          uri: imageUri,
          type: 'image/jpg',
          name: 'image',
        });
    await axios
      .post(commentUrl, formData)
      .then(response => {
        toastMessage(toast, response.data.message);
        getTaskDetails();
        setComment('');
        commentBox.current.clear();
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const getPermission = async type => {
    try {
      setLoading(true);
      var token = await AsyncStorage.getItem('token');
      var userID = await AsyncStorage.getItem('user_id');
      await axios
        .post(getPermissionUrl, {
          token: token,
          task_id: data.id,
        })
        .then(response => {
          console.log(response.data);
          if (response.status === 200) {
            if (response.data?.data) {
              type === 'task-update'
                ? navigation.navigate('add_task', {
                    data: response.data?.data,
                    comeFrom: 'update_task',
                  })
                : setModalVisible(true);
            }
            toastMessage(toast, response.data?.message);
            setLoading(false);
          }
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

  const taskIssueImage = async () => {
    var token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('token', token);
    formData.append('task_id', data.id);
    imageUri === ''
      ? formData.append('task_issue_image', '')
      : formData.append('task_issue_image', {
          uri: imageUri,
          type: 'image/jpg',
          name: 'image',
        });
    const response = await axios.post(taskIssueImageUrl, formData);
    if (response.status === 200) {
      console.log(imageUri);
    }
  };

  const getTaskIssueImage = async () => {
    try {
      var token = await AsyncStorage.getItem('token');
      const response = await axios.post(getTaskIssueImageUrl, {
        token: token,
        task_id: data.id,
      });
      if (response.status === 200) {
        getTaskIssueImages(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setLoading(true);
    getTaskDetails();
  }, []);

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
        {Condition.BooleanCondition(taskDetails[0]?.task_status) && (
          <Appbar.Action
            icon="pencil"
            size={18}
            onPress={() => getPermission('task-update')}
          />
        )}
        {Condition.Completed(taskDetails[0]?.task_status) ? (
          <Appbar.Action
            safeAreaInsets={true}
            icon="autorenew"
            size={18}
            color={ColorConstants.primaryBlack}
            onPress={() => {
              reopenOptionRef.current.show();
            }}
            style={{
              marginLeft: -5,
              marginRight: 10,
            }}
          />
        ) : Condition.Approved(taskDetails[0]?.task_status) ? null : (
          <Appbar.Action
            icon="check"
            size={18}
            color={ColorConstants.primaryBlack}
            onPress={() => {
              completeOptionRef.current.show();
            }}
            style={{
              marginLeft: -5,
              marginRight: 10,
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
          date={TimeCondition.current}
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
              toastMessage.showMessage(response.data?.message);
            });
            setModalVisible(!modalVisible);
          }}
        />
      </Modal>
      <ScrollView
        style={styles.scroll_styles}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }>
        {Condition.StatusCondition(taskDetails[0]?.task_status) ? (
          <View
            style={{
              width: '100%',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              backgroundColor:
                taskDetails[0]?.task_status === 'Completed'
                  ? ColorConstants.yellowCompleteColor
                  : ColorConstants.buttonGreenColor,
            }}>
            <Text
              style={{
                fontSize: 17,
                padding: 10,
                fontWeight: '500',
                color: ColorConstants.primaryWhite,
              }}>
              {Condition.SingleCondition(taskDetails[0]?.task_status)}
            </Text>
          </View>
        ) : (
          <View />
        )}
        <AppSize height={10} />
        <Label name={Condition.Title(taskDetails[0]?.task_title)} margin={5} />
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
              margin={5}
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
            <Label name={Condition.Title(taskDetails[0]?.name)} margin={5} />
          </View>
        </View>
        <AppSize height={10} />
        <View style={styles.time_container_styles}>
          <TimeContainer
            dateLabel={'Actual Date'}
            date={TimeCondition.monthDate(
              taskDetails[0]?.actual_deadline.slice(0, 10),
            )}
            color={ColorConstants.buttonGreenColor}
            style={{
              borderColor: ColorConstants.buttonGreenColor,
              color: ColorConstants.buttonGreenColor,
            }}
          />
          <AppSize width={5} />

          <TouchableOpacity
            style={styles.flex}
            onPress={() =>
              Condition.BooleanCondition(taskDetails[0]?.task_status) &&
              getPermission('date-update')
            }>
            <TimeContainer
              dateLabel={'Deadline'}
              date={TimeCondition.monthDate(
                taskDetails[0]?.task_deadline.slice(0, 10),
              )}
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
            date={TimeCondition.monthDate(
              taskDetails[0]?.created_at.slice(0, 10),
            )}
            color={ColorConstants.primaryBlack}
            style={{
              borderColor: ColorConstants.primaryBlack,
              color: ColorConstants.primaryBlack,
            }}
          />
        </View>
        <AppSize height={10} />
        <Label name={'Task Image'} margin={5} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 5,
          }}>
          {taskDetails[0]?.task_image.split('.').pop() === 'jpg' && (
            <Avatar
              onPress={() => {
                navigation.navigate('taskImage', {
                  images: TaskImage(taskDetails[0]?.task_image),
                });
              }}
              size={40}
              containerStyle={{
                marginHorizontal: 10,
                borderRadius: 5,
              }}
              renderPlaceholderContent={<ActivityIndicator />}
              placeholderStyle={{
                backgroundColor: ColorConstants.primaryWhite,
              }}
              source={{
                uri: TaskImage(taskDetails[0]?.task_image),
              }}
            />
          )}
          {taskIssueImages &&
            taskIssueImages.map(
              (data, index) =>
                data?.task_issue_image.split('.').pop() === 'jpg' && (
                  <Avatar
                    onPress={() => {
                      navigation.navigate('taskImage', {
                        images: TaskIssueImage(data.task_issue_image),
                      });
                    }}
                    key={index}
                    size={40}
                    containerStyle={{
                      marginHorizontal: 10,
                      borderRadius: 5,
                    }}
                    renderPlaceholderContent={<ActivityIndicator />}
                    placeholderStyle={{
                      backgroundColor: ColorConstants.primaryWhite,
                    }}
                    source={{
                      uri: TaskIssueImage(data.task_issue_image),
                    }}
                  />
                ),
            )}
          <TouchableOpacity
            style={styles.attachment}
            onPress={() => {
              Condition.BooleanCondition(taskDetails[0]?.task_status) &&
                ImageCropPicker.openPicker({
                  compressImageMaxWidth: 300,
                  compressImageMaxHeight: 300,
                  cropping: false,
                  multiple: false,
                })
                  .then(image => {
                    updateImage(image.path);
                    taskIssueImage();
                  })
                  .catch(error => console.log(error));
            }}>
            <Ionicons
              name={'add'}
              color={ColorConstants.textHintColor}
              size={18}
            />
          </TouchableOpacity>
        </View>
        <AppSize height={10} />
        <View style={styles.task_assignee}>
          <View style={styles.task_assignee_row}>
            <Counter
              onTap={() => {
                navigation.navigate('task_assignee', {
                  header: 'Task Assignee',
                  taskId: taskDetails[0]?.assined_ids,
                });
              }}
              counterLabel="Task Assignee"
              counter={
                taskDetails[0]?.assined_ids !== ''
                  ? taskDetails[0]?.assined_ids.split(',').length
                  : ''
              }
            />
            <Counter
              style={{
                borderTopRightRadius: 5,
                borderTopLeftRadius: 0,
              }}
              onTap={() => {
                  navigation.navigate('task_assignee', {
                    header: 'Project Assignee',
                    projectId: data.project_id,
                  });
              }}
              counterLabel="Project Assignee"
              counter={projectData.map(projectItems =>
                projectItems.id === data.project_id
                  ? projectItems.project_cordinator_id.split(',').length
                  : '',
              )}
            />
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
                            color: ColorConstants.teamHiColor,
                          }}>
                          {TimeCondition.fullDate(data.created_at)}
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
                            {data.images !== '' &&
                              data?.images.split('.').pop() === 'jpg' && (
                                <Avatar
                                  key={index}
                                  size={35}
                                  containerStyle={{
                                    marginHorizontal: 10,
                                    marginVertical: 10,
                                    elevation: 10,
                                    borderRadius: 10,
                                  }}
                                  renderPlaceholderContent={
                                    <ActivityIndicator />
                                  }
                                  placeholderStyle={{
                                    backgroundColor:
                                      ColorConstants.primaryWhite,
                                  }}
                                  onPress={() => {
                                    navigation.navigate('taskImage', {
                                      images: TaskChatImage(data?.images),
                                    });
                                  }}
                                  source={{
                                    uri: TaskChatImage(data?.images),
                                  }}
                                />
                              )}
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
        <AppSize height={10} />
      </ScrollView>
      <View style={styles.bottom_container}>
        <View style={styles.text_input_container}>
          <TextInput
            style={styles.flex}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="comment"
            editable={Condition.BooleanCondition(data.task_status)}
            textAlignVertical="center"
            placeholderTextColor={ColorConstants.textLightBlack1}
            multiline={true}
            ref={commentBox}
            numberOfLines={4}
            color={ColorConstants.primaryBlack}
            onChangeText={text => {
              setComment(text);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (Condition.StatusCondition(data.task_status)) {
                toastMessage(toast, 'Task Completed');
              } else {
                ImageCropPicker.openPicker({
                  compressImageMaxWidth: 300,
                  compressImageMaxHeight: 300,
                  cropping: false,
                  multiple: false,
                })
                  .then(image => {
                    if (image) {
                      navigation.navigate('profile_image', {
                        data: [],
                        images: image.path,
                        taskId: data.id,
                        comeFrom: 'Task Details',
                      });
                    }
                  })
                  .catch(error => console.log(error));
              }
            }}>
            <Ionicons
              name={'attach'}
              color={ColorConstants.textLightBlack1}
              size={24}
            />
          </TouchableOpacity>
          <AppSize width={10} />
          <TouchableOpacity
            onPress={() => {
              if (Condition.StatusCondition(data.task_status)) {
                toastMessage(toast, 'Task Completed');
              } else {
                comment !== ''
                  ? sendComment()
                  : toastMessage(toast, 'Please enter the Comments');
              }
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
              completeOptionRef.current.hide();
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
    flex: 1,
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
    paddingHorizontal: 10,
    marginBottom: 10,
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
    height: 200,
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
