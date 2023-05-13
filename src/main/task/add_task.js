/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Label} from '../../components/label';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/app_button';
import AppSize from '../../components/size';
import {RadioButton, Checkbox} from 'react-native-paper';
import SearchBox from '../../components/search_box';
import {Loading, NoData} from '../../components/no_data_found';
import {MaterialIcons} from '../../components/icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import moment from 'moment';
import AppHeader from '../../components/app_header';
import ToastMessage from '../../components/toast_message';
import BottomSheet from '../../components/bottom_sheet';
import CalenderContainer from '../../components/calender';

const AddTask = ({navigation, route}) => {
  const {data, comeFrom} = route?.params;
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState([]);
  const [getSearchAssingee, setSearchAssignee] = useState([]);
  const [assignee, setAssignee] = useState([]);
  const [priority, setPriority] = useState('High');
  const [getProject, selectProject] = useState('');
  const [getDeadline, setTaskDeadline] = useState(
    moment().utcOffset('+05:30').format('YYYY-MM-DD'),
  );
  const [getProjectId, setProjectId] = useState('');
  const [userData, setData] = useState([]);
  const [searchUser, setSearchData] = useState(userData);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedItems, setCheckedItems] = useState([]);
  const {height, width} = Dimensions.get('screen');
  const selectUser = [];
  const [modalVisible, setModalVisible] = useState(false);

  const url = BaseUrl(ApiConstants.myProjectList);
  const url1 = BaseUrl(ApiConstants.projectWiseMember);
  const addTaskUrl = BaseUrl(ApiConstants.addTask);
  const updateTaskUrl = BaseUrl(ApiConstants.taskUpdate);
  const refRBSheet = useRef();
  var date = moment().utcOffset('+05:30').format('YYYY-MM-DD');

  const checking = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      const response = await axios.post(url, {
        token: token,
        id: user_Id,
      });
      setProject(response.data.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getAssignee = async ({id: project_id}) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      const response = await axios.post(url1, {
        token: token,
        project_id: project_id,
      });
      setSearchAssignee(response.data?.data);
      setAssignee(response.data?.data);
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

  const submitTask = async () => {
    try {
      if (!title) {
        ToastMessage.showMessage('Title is required');
      } else if (searchUser.length === 0) {
        ToastMessage.showMessage('Assignee required');
      } else if (!getProjectId) {
        ToastMessage.showMessage('Project is required');
      } else {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const user_Id = await AsyncStorage.getItem('user_id');
        const response = await axios.post(addTaskUrl, {
          token: token,
          task_title: title,
          priority: priority,
          task_deadline: getDeadline,
          client_view: true,
          assigned_status: searchUser.length === 0 ? 'No' : 'Yes',
          self: searchUser.length === 0 ? 'Yes' : 'No',
          description: description,
          assined_ids: searchUser.map(data => data.id).toString(),
          project_id: getProjectId,
          user_id: user_Id,
          taskImage: '',
        });
        if (response.status === 200) {
          console.log(response.data);
          ToastMessage.showMessage(response.data?.message);
          setLoading(false);
          navigation.navigate('dashboard');
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('this is the error===', error);
    }
  };

  const updateTask = async () => {
    try {
      if (!title) {
        ToastMessage.showMessage('Title is required');
      } else {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const user_Id = await AsyncStorage.getItem('user_id');
        const response = await axios.post(updateTaskUrl, {
          token: token,
          task_id: data.id,
          task_title: title,
          priority: priority,
          task_deadline: getDeadline,
          assigned_status: searchUser.length === 0 ? 'No' : 'Yes',
          description: description,
          assined_ids: data.assined_ids,
          project_id: getProjectId,
          id: user_Id,
        });
        if (response.status === 200) {
          console.log(response.data);
          ToastMessage.showMessage(response.data?.message);
          setLoading(false);
          navigation.navigate('task_details_screen', {
            data: data,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('this is the error===', error);
    }
  };

  const handleRemove = id => {
    const remove = searchUser.filter(data => data.id !== id);
    setSearchData(remove);
  };

  useEffect(() => {
    const initCheckedItems = {};
    assignee.forEach(item => {
      initCheckedItems[item.id] = false;
    });
    setCheckedItems(initCheckedItems);
    const updateTask = () => {
      if (comeFrom === 'update_task') {
        setTitle(data.task_title);
        setProjectId(data.project_id);
        selectProject(
          project.map(data => data?.project_name === data.project_name),
        );
        setDescription(data.description);
        setPriority(data.priority);
        setTaskDeadline(data.task_deadline);
      }
    };
    updateTask();
    checking();
  }, []);

  return (
    <View>
      <AppHeader
        text={comeFrom === 'update_task' ? 'Update Task' : 'Add Task'}
        navigate={() => navigation.goBack()}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: modalVisible
              ? 'rgba(0,0,0,0.0)'
              : ColorConstants.primaryWhite,
          },
        ]}>
        <ScrollView>
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
              onSelect={() => setModalVisible(!modalVisible)}
            />
          </Modal>
          <Label name={'Title'} style={styles.labelmargin} />
          <TextInput
            value={title}
            placeholder="Enter task title"
            placeholderTextColor={ColorConstants.textLightBlack1}
            style={styles.inputText}
            textAlignVertical='center'
            onChangeText={text => setTitle(text)}
          />
          <Label name={'Description'} style={styles.labelmargin} />
          <TextInput
            value={description}
            placeholder="Enter task Description"
            textAlignVertical='center'
            placeholderTextColor={ColorConstants.textLightBlack1}
            style={styles.inputText}
            onChangeText={text => setDescription(text)}
          />

          {comeFrom !== 'update_task' && (
            <View>
              <Label name={'Project'} style={styles.labelmargin} />
              <SelectList
                data={project.map((data, _index) => data?.project_name)}
                setSelected={val => {
                  var id;
                  for (var i = 0; i < project.length; i++) {
                    if (project[i].project_name === val) {
                      id = project[i].id;
                    }
                  }
                  selectProject(val);
                  console.log('---', val);
                  console.log('---id ', id);
                  setProjectId(id);
                  getAssignee({id: id});
                }}
                search={false}
                notFoundText={'No Project Found'}
                dropdownTextStyles={styles.dropdownTextStyles}
                placeholder={getProject && 'Select Project'}
                inputStyles={styles.inputStyles}
                onSelect={() => {
                  console.log('---get Project', getProject);
                }}
  
                color={ColorConstants.primaryBlack}
                placeholderTextColor={ColorConstants.textLightBlack1}
                boxStyles={styles.boxStyles}
              />
              <Label name={'Assignee'} style={styles.labelmargin} />
              <View
                style={{
                  flexDirection: 'column',
                }}>
                {assignee.length > 0 && searchUser.length > 0 ? (
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{
                      flexGrow: 1,
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
                  refRBSheet.current.show();
                }}
                style={styles.add}>
                <Text style={styles.add_text}>+ Add</Text>
              </TouchableOpacity>
            </View>
          )}
          <BottomSheet
            refer={refRBSheet}
            backButton={() => refRBSheet.current.hide()}
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
                <View style={styles.bottomButtonRow}>
                  <AppButton
                    text={'Cancel'}
                    style={styles.cencal}
                    textStyle={{
                      color: ColorConstants.primaryColor,
                    }}
                    onPress={() => {
                      refRBSheet.current.hide();
                    }}
                  />
                  <AppSize width={20} />
                  <AppButton
                    text={'Done'}
                    style={{flex: 1}}
                    onPress={() => {
                      console.log(searchUser);
                      refRBSheet.current.hide();
                    }}
                  />
                </View>
                <AppSize height={20} />
              </View>
            }
          />

          <View style={styles.radiobuttonContainer}>
            <View>
              <Label name={'Priority'} />
            </View>
            <RadioButton.Group
              onValueChange={value => setPriority(value)}
              value={priority}>
              <View style={styles.row}>
                <RadioButton.Item
                  color={ColorConstants.highLightColor}
                  label="High"
                  value="High"
                />
                <RadioButton.Item
                  color={ColorConstants.highLightColor}
                  label="Low"
                  value="Low"
                />
              </View>
            </RadioButton.Group>
          </View>
          <AppSize height={10} />
          <View style={styles.date_container}>
            <View style={styles.flex}>
              <Label name={'DeadLine'} />
            </View>
            <TouchableOpacity
              style={styles.date_picker}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Ionicons name={'calendar'} color={ColorConstants.primaryBlack} />
              <AppSize width={10} />
              <Text style={{color: ColorConstants.primaryBlack}}>
                {moment(getDeadline).utcOffset('+05:30').format('MMM DD, YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
          <AppSize height={10} />
          <View style={styles.attachmentContainer}>
            <TouchableOpacity style={styles.attachment}>
              <Ionicons
                name={'add'}
                size={24}
                color={ColorConstants.textLightBlack1}
              />
            </TouchableOpacity>
            <AppSize width={10} />
            <Label name={' Add a attachment (Optional)'} />
          </View>
          <AppSize height={20} />
          <AppButton
            text={comeFrom === 'update_task' ? 'Update Task' : 'Add Task'}
            onPress={() => {
              comeFrom === 'update_task' ? updateTask() : submitTask();
            }}
          />
        </ScrollView>
      </View>

      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 0,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: ColorConstants.primaryWhite,
    paddingHorizontal: 10,
  },
  labelmargin: {
    marginVertical: 5,
    marginTop: 10,
  },
  inputText: {
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: ColorConstants.primaryBlack,
    paddingVertical: 15
  },
  textInputView: {
    paddingHorizontal: 5,
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 5,
    height: 48,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  dropdownTextStyles: {
    color: ColorConstants.textDarkBlack,
    fontSize: 14,
    fontWeight: '400',
  },
  inputStyles: {
    color: ColorConstants.primaryBlack,
    fontSize: 14,
    fontWeight: '400',
  },
  boxStyles: {
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: ColorConstants.primaryBlack,
  },
  add: {
    backgroundColor: ColorConstants.primaryBlack,
    padding: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 100,
  },
  add_text: {
    fontWeight: '600',
    color: ColorConstants.primaryWhite,
  },
  radiobuttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date_container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  date_picker: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderRadius: 100,
    padding: 10,
    borderColor: ColorConstants.textLightBlack1,
    backgroundColor: ColorConstants.primaryWhite,
  },
  attachmentContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  assigneeChip: {
    borderColor: ColorConstants.primaryBlack,
    borderWidth: 1,
    borderRadius: 100,
    marginVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderColor: ColorConstants.primaryBlack,
    borderWidth: 2,
    borderRadius: 100,
    flexDirection: 'row',
    backgroundColor: ColorConstants.primaryBlack,
  },
  chipText: {
    color: ColorConstants.primaryBlack,
    fontFamily: 'poppins',
    fontWeight: '700',
    padding: 8,
  },
  bottomButtonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flexDirection: 'row',
    backgroundColor: ColorConstants.primaryWhite,
  },
  cencal: {
    flex: 1,
    backgroundColor: ColorConstants.primaryWhite,
    borderColor: ColorConstants.primaryColor,
    borderWidth: 2,
    borderRadius: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 100,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: ColorConstants.primaryBlack,
  },
});

export default AddTask;
