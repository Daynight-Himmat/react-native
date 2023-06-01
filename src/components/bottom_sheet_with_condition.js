import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import BottomSheet from './bottom_sheet';
import TaskOption from './task_options';
import TaskAlert from './task_alert';
import {RadioButton, Checkbox} from 'react-native-paper';
import AppButton from './app_button';
import ColorConstants from '../constants/color_constants';
import {MaterialIcons} from './icons';
import {Label} from './label';
import FontConstants from '../constants/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiConstants, BaseUrl, BaseUrl1} from '../constants/api_constants';
import AppSize from './size';
import {NoData} from './no_data_found';
import SearchBox from './search_box';
import RowButton from './row_button';
import toastMessage from './toast_message';
import {useToast} from 'react-native-toast-notifications';

const BottomSheetConditions = ({
  bottomSheetRef,
  changePriorityRef,
  assigneeOptionRef,
  completeOptionRef,
  deleteOptionRef,
  reopenOptionRef,
  selectAssigneeRef,
  approveTaskRef,
  onPressComplete,
  onPressDelete,
  onPressReopen,
  onPressPriority,
  onPressAssignee,
  onPressApproved,
  checked,
  onValueChange,
  status,
  project_id,
  taskData,
  navigation,
}) => {
  const toast = useToast();
  const [assignee, setAssignee] = useState([]);
  const [userId, setUserId] = useState();
  const [roleId, setRoleId] = useState();
  const [isLoading, setLoading] = useState(false);
  const [searchUser, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedItems, setCheckedItems] = useState([]);
  const [getSearchAssingee, setSearchAssignee] = useState([]);
  const url1 = BaseUrl(ApiConstants.projectWiseMember);
  const changeAssigneeUrl = BaseUrl(ApiConstants.changeTaskAssignee);
  const selectUser = [];

  const getAssignee = useCallback(
    async projectId => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('user_id');
        const roleId = await AsyncStorage.getItem('role_id');
        const token = await AsyncStorage.getItem('token');
        setUserId(userId);
        setRoleId(roleId);
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
    },
    [url1],
  );

  const updateAssignee = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      console.log({
        id: taskData.user_id,
        task_id: taskData.id,
        assined_ids: searchUser.map(item => item.id).toString(),
        new_assignee: searchUser.map(item => item.id).toString(),
      });
      const response = await axios.post(changeAssigneeUrl, {
        token: token,
        id: taskData.user_id,
        task_id: taskData.id,
        assined_ids: searchUser.map(item => item.id).toString(),
        new_assignee: searchUser.map(item => item.id).toString(),
      });
      if (response.status === 200) {
        toastMessage(toast, response.data?.message);
        assigneeOptionRef.current.hide();
        bottomSheetRef.current.hide();
        navigation.navigate('approve', {
          taskStatus: 'assignee',
        });
        console.log(response.data);
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

  useEffect(() => {
    getAssignee(project_id);
    const initCheckedItems = {};
    setCheckedItems(initCheckedItems);
  }, [getAssignee, project_id]);

  return (
    <View>
      <BottomSheet
        refer={bottomSheetRef}
        backButton={() => bottomSheetRef.current.hide()}
        widget={
          <View>
            <TaskOption
              roleId={roleId}
              status={status}
              data={taskData}
              userId={userId}
              onPressPriority={() => {
                // bottomSheetRef.current.hide();
                changePriorityRef.current.show();
              }}
              onPressComplete={() => {
                // bottomSheetRef.current.hide();
                completeOptionRef.current.show();
              }}
              onPressDelete={() => {
                // bottomSheetRef.current.hide();
                deleteOptionRef.current.show();
              }}
              onPressReopen={() => {
                // bottomSheetRef.current.hide();
                reopenOptionRef.current.show();
              }}
              onPressChangeAssignee={() => {
                // bottomSheetRef.current.hide();
                assigneeOptionRef.current.show();
              }}
              onPressApproved={() => {
                // bottomSheetRef.current.hide();
                approveTaskRef.current.show();
              }}
            />
            <BottomSheet
              refer={completeOptionRef}
              backButton={() => completeOptionRef.current.hide()}
              widget={
                <TaskAlert
                  buttonLabel={'Complete'}
                  label={'Are you sure you want to close the task.'}
                  onBack={() => completeOptionRef.current.hide()}
                  onPress={onPressComplete}
                />
              }
            />

            <BottomSheet
              refer={approveTaskRef}
              backButton={() => approveTaskRef.current.hide()}
              widget={
                <TaskAlert
                  buttonLabel={'Approve'}
                  label={'Are you sure you want to Approved the task.'}
                  onBack={() => approveTaskRef.current.hide()}
                  onPress={onPressApproved}
                />
              }
            />

            <BottomSheet
              refer={assigneeOptionRef}
              backButton={() => assigneeOptionRef.current.hide()}
              widget={
                <View>
                  <Label name={'Assignee'} />
                  <View>
                    {assignee.length > 0 && searchUser.length > 0 ? (
                      <ScrollView
                        horizontal={true}
                        contentContainerStyle={styles.padding}>
                        {searchUser.length > 0 ? (
                          searchUser.map((userid, i) => (
                            <View key={i} style={styles.row}>
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
                                <Text style={styles.chipText}>
                                  {userid.name}
                                </Text>
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
                  <View style={styles.padding}>
                    <RowButton
                      onPress={() => {
                        if (searchUser.length === 0) {
                          toastMessage(toast, 'Please Select Assignee First');
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
                <View style={styles.searchBox}>
                  <SearchBox
                    onChangeText={handleSearch}
                    onPress={() => {
                      handleSearch(searchQuery);
                    }}
                  />
                  <View style={styles.flex}>
                    {assignee.length > 0 ? (
                      <ScrollView contentContainerStyle={styles.padding}>
                        {assignee.map((data, index) => (
                          <View key={index} style={styles.check_container}>
                            <Checkbox.Item
                              label={data.name}
                              labelStyle={styles.width}
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
                                  searchUser.push({
                                    id: data.id,
                                    name: data.name,
                                  });
                                  setSearchData(searchUser);
                                } else {
                                  searchUser.pop({
                                    id: data.id,
                                    name: data.name,
                                  });
                                  setSearchData(searchUser);
                                }
                                console.log(checkedItems);
                              }}
                            />
                          </View>
                        ))}
                      </ScrollView>
                    ) : (
                      <NoData />
                    )}
                  </View>
                  <View style={styles.padding}>
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
                  onPress={onPressDelete}
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
                  onPress={onPressReopen}
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
                    <RadioButton.Group
                      onValueChange={onValueChange}
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
                    onPress={onPressPriority}
                  />
                </View>
              }
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  assigneeChip: {
    borderColor: ColorConstants.primaryBlack,
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  radioContainerSyle: {
    padding: 10,
    marginBottom: 20,
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
  bottomButtonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flexDirection: 'row',
    backgroundColor: ColorConstants.primaryWhite,
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
  add: {
    backgroundColor: ColorConstants.primaryBlack,
    padding: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  add_text: {
    fontWeight: '600',
    color: ColorConstants.primaryWhite,
  },
  padding: {
    paddingVertical: 10,
  },
  width: {
    width: '90%',
  },
  check_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paddingVertical: {
    paddingVertical: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.primaryWhite,
  },
  flex: {
    flex: 1,
  },
});

export default BottomSheetConditions;
