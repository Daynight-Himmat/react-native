/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Label} from '../../components/label';
import {ApiConstants, BaseUrl1, BaseUrl} from '../../constants/api_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/app_button';
import AppSize from '../../components/size';
import {RadioButton, Checkbox} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import SearchBox from '../../components/search_box';
import {Loading, NoData} from '../../components/no_data_found';
import {MaterialIcons} from '../../components/icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

const AddTask = ({navigation}) => {
  const [checked, setChecked] = useState('first');
  const [checkedBox, setCheckBoxed] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState([]);
  const [assignee, setAssignee] = useState([]);
  const [priority, setPriority] = useState('');
  const [getProject, selectProject] = useState('');
  const [getProjectId, setProjectId] = useState('');
  const [getAssign, selectAssignee] = useState('');
  const [userData, setData] = useState([]);
  const [searchUser, setSearchData] = useState(userData);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [assigneeSelected, setSelectedAssignee] = useState([]);
  const {height, width} = Dimensions.get('screen');
  const selectUser = [];
  const [modalVisible, setModalVisible] = useState(false);

  const url = BaseUrl(ApiConstants.myProjectList);
  const url1 = BaseUrl(ApiConstants.projectWiseMember);
  const addTask = BaseUrl1(ApiConstants.addTask);
  const refRBSheet = useRef();
  var date = moment().utcOffset('+05:30').format('YYYY-MM-DD');

  const checking = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      console.log({userId: user_Id, token: token});
      const response = await axios.post(url, {
        token: token,
        id: user_Id,
      });
      setProject(response.data.data?.data);
      setLoading(false);
      console.log(response.data.data?.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getAssignee = async ({id: project_id}) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      console.log({userId: user_Id, token: token, project_id: project_id});
      const response = await axios.post(url1, {
        token: token,
        project_id: project_id,
      });
      setAssignee(response.data?.data);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSearch = text => {
    if (text === '') {
      setSearchData(userData);
    } else {
      const filtered = userData.filter(item => {
        return (
          item.name?.toLowerCase().includes(text.toLowerCase()) ||
          item.designation?.toLowerCase().includes(text.toLowerCase())
        );
      });
      setSearchData(filtered);
    }
  };

  const submitTask = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      console.log({userId: user_Id, token: token});
      const response = await axios.post(addTask, {
        token: token,
        task_title: title,
        priority: '',
        task_deadline: '',
        client_view: '',
        task_image: '',
        assigned_status: '',
        self: '',
        description: description,
        assined_ids: '',
        project_id: getProjectId,
        user_id: user_Id,
      });
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const assigneeContainer = (data, index) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
        }}>
        <View style={styles.assigneeChip}>
          <TouchableOpacity
            onPress={() => {
              setSelectedAssignee(searchUser.pop(data.id));
              checkedItems[data.id] = false;
              console.log(selectUser);
              console.log(checkedItems);
            }}
            style={styles.cancelButton}>
            <MaterialIcons
              name={'clear'}
              color={ColorConstants.primaryWhite}
              size={12}
            />
          </TouchableOpacity>
          <Text style={styles.chipText}>{data.name}</Text>
        </View>
        <AppSize width={10} />
      </View>
    );
  };

  const checkListTile = (data, index) => {
    return (
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
              ? searchUser.map(e => e === data.id) === checkedItems[data.id]
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
              searchUser.push(data.id);
              setSelectedAssignee(searchUser);
            } else {
              searchUser.pop(data.id);
              setSelectedAssignee(searchUser);
            }
            console.log(checkedItems);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    const initCheckedItems = {};
    assignee.forEach(item => {
      initCheckedItems[item.id] = false;
    });
    setCheckedItems(initCheckedItems);
    checking();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Calendar
                // disableArrowLeft={true}
                minDate={date}
                initialDate={date}
                onDayPress={day => {
                  console.log('selected day', day.dateString);
                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={day => {
                  console.log('selected day', day);
                }}
                markedDates={{
                  '2023-04-16': {
                    selected: true,
                    marked: true,
                    selectedColor: ColorConstants.primaryColor,
                  },
                  '2012-05-17': {marked: true},
                  '2012-05-18': {
                    marked: true,
                    dotColor: 'red',
                    activeOpacity: 0,
                  },
                  '2012-05-19': {disabled: true, disableTouchEvent: true},
                }}
                theme={{
                  backgroundColor: ColorConstants.primaryColor,
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  textSectionTitleDisabledColor: '#d9e1e8',
                  selectedDayBackgroundColor: ColorConstants.primaryColor,
                  selectedDayTextColor: ColorConstants.primaryColor,
                  todayTextColor: ColorConstants.primaryColor,
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  dotColor: '#00adf5',
                  selectedDotColor: '#ffffff',
                  arrowColor: 'orange',
                  disabledArrowColor: '#d9e1e8',
                  monthTextColor: ColorConstants.primaryColor,
                  indicatorColor: 'blue',
                  textDayFontFamily: 'monospace',
                  textMonthFontFamily: 'monospace',
                  textDayHeaderFontFamily: 'monospace',
                  textDayFontWeight: '300',
                  // textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16,
                }}
              />
              <View style={styles.bottomButtonRow}>
                <AppButton
                  text={'Cancel'}
                  style={styles.cencal}
                  textStyle={{
                    color: ColorConstants.primaryColor,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                />
                <AppSize width={20} />
                <AppButton
                  text={'Select'}
                  style={{flex: 1}}
                  onPress={() => {
                    console.log(searchUser);
                    refRBSheet.current.close();
                  }}
                />
              </View>
              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}
            </View>
          </View>
        </Modal>
        <Label name={'Title'} />
        <TextInput
          placeholder="Enter task title"
          placeholderTextColor={ColorConstants.textLightBlack1}
          style={styles.inputText}
          onChangeText={text => setTitle(text)}
        />
        <Label name={'Description'} />
        <TextInput
          placeholder="Enter task Description"
          multiline={true}
          placeholderTextColor={ColorConstants.textLightBlack1}
          style={styles.inputText}
          onChangeText={text => setDescription(text)}
        />

        <Label name={'Project'} />
        <SelectList
          data={project.map((data, index) => data?.project_name)}
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
          fontFamily={'400'}
          color={ColorConstants.primaryBlack}
          placeholderTextColor={ColorConstants.textLightBlack1}
          boxStyles={styles.boxStyles}
        />
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
              }}>
              {assigneeSelected.length > 0 ? (
                assigneeSelected.map(
                  (userid, i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View style={styles.assigneeChip}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedAssignee([
                              searchUser.pop({
                                id: userid.id,
                                name: userid.name,
                              }),
                            ]);
                            checkedItems[userid.id] = false;
                            console.log(
                              userid.id,
                              userid.name,
                              assigneeSelected,
                            );
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
                  ),
                  // assignee.map((data, index) =>
                  //   userid === data.id ? (
                  //     <View
                  //       key={index}
                  //       style={{
                  //         flexDirection: 'row',
                  //       }}>
                  //       <View style={styles.assigneeChip}>
                  //         <TouchableOpacity
                  //           onPress={() => {
                  //             checkedItems[data.id] = false;
                  //             console.log(data.id, data.name, assigneeSelected);
                  //             // console.log(selectUser);
                  //             // console.log(checkedItems);
                  //           }}
                  //           style={styles.cancelButton}>
                  //           <MaterialIcons
                  //             name={'clear'}
                  //             color={ColorConstants.primaryWhite}
                  //             size={12}
                  //           />
                  //         </TouchableOpacity>
                  //         <Text style={styles.chipText}>{data.name}</Text>
                  //       </View>
                  //       <AppSize width={10} />
                  //     </View>
                  //   ) : (
                  //     <View key={index} />
                  //   ),
                  // ),
                )
              ) : (
                <View />
              )}
            </ScrollView>
          ) : (
            <View style={{flex: 1, flexDirection: 'column'}}>
              <NoData />
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.open();
          }}
          style={styles.add}>
          <Text style={styles.add_text}>+ Add</Text>
        </TouchableOpacity>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={height / 2}
          animationType="slide"
          customStyles={{
            wrapper: {
              color: 'transparent',
            },
            draggableIcon: {
              backgroundColor: 'transparent',
              width: 100,
            },
            container: {
              backgroundColor: ColorConstants.primaryWhite,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              width: '100%',
              elevation: 100,
            },
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              paddingHorizontal: 10,
              backgroundColor: ColorConstants.primaryWhite,
            }}>
            <SearchBox onChangeText={handleSearch} />
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
                            setSelectedAssignee(searchUser);
                          } else {
                            searchUser.pop({id: data.id, name: data.name});
                            setSelectedAssignee(searchUser);
                          }
                          console.log(checkedItems);
                        }}
                      />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={{flex: 1, flexDirection: 'column'}}>
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
                  refRBSheet.current.close();
                }}
              />
              <AppSize width={20} />
              <AppButton
                text={'Done'}
                style={{flex: 1}}
                onPress={() => {
                  console.log(searchUser);
                  refRBSheet.current.close();
                }}
              />
            </View>
          </View>
        </RBSheet>
        <AppSize height={20} />
        <View style={styles.radiobuttonContainer}>
          <View>
            <Label name={'Priority'} />
          </View>
          <RadioButton.Group
            onValueChange={value => setChecked(value)}
            value={checked}>
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
            <Ionicons
              name={'calendar'}
              color={ColorConstants.textLightBlack1}
            />
            <AppSize width={10} />
            <Text style={{color: ColorConstants.textLightBlack1}}>
              Jan 30, 2023
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
          text={'Add Task'}
          onPress={() => {
            submitTask();
          }}
        />
      </View>
      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    elevation: 0,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: ColorConstants.primaryWhite,
    paddingHorizontal: 10,
  },
  inputText: {
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: ColorConstants.primaryBlack,
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
