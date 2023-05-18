import React, {useEffect, useState, useRef} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import ColorConstants from '../../constants/color_constants';
import {Label} from '../../components/label';
import {ApiConstants, BaseUrl, BaseUrl1} from '../../constants/api_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/app_button';
import AppSize from '../../components/size';
import {AppHeader} from '../../components/app_header';
import {MaterialIcons} from '../../components/icons';
import moment from 'moment';
import {Loading, NoData} from '../../components/no_data_found';
import BottomSheet from '../../components/bottom_sheet';
import SearchBox from '../../components/search_box';
import {Checkbox} from 'react-native-paper';
import toastMessage from '../../components/toast_message';
import CalenderContainer from '../../components/calender';
import {useToast} from 'react-native-toast-notifications';
import TimeCondition from '../../components/time_condition';
import FontConstants from '../../constants/fonts';
import DropDownMenu from '../../components/dropdown';

const CreateProject = ({navigation, route}) => {
  const {comeFrom, projectInfo} = route.params;
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [checked, setChecked] = useState('first');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [getComapanySelect, setCompanySelect] = useState([]);
  const [getAssigne, setAssignee] = useState([]);
  const [getSearchAssingee, setSearchAssignee] = useState([]);
  const [getComapany, setCompanies] = useState([]);
  const [priority, setPriority] = useState('');
  const [getProject, selectProject] = useState('');
  const [getProjectId, setProjectId] = useState('');
  const [teamCoordinator, selectTeamCoordinator] = useState('');
  const [teamNameCoordinator, setTeamNameCoordinator] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setData] = useState([]);
  const [searchUser, setSearchData] = useState(userData);
  const [getDeadline, setTaskDeadline] = useState(
    moment().utcOffset('+05:30').format('YYYY-MM-DD'),
  );
  const [checkedItems, setCheckedItems] = useState([]);
  var date = moment().utcOffset('+05:30').format('YYYY-MM-DD');

  const getAssigneeTeam = BaseUrl(ApiConstants.getUserList);
  const getCompanyList = BaseUrl(ApiConstants.companyList);
  const createProjectUrl = BaseUrl(ApiConstants.createProject);
  const updateProjectUrl = BaseUrl(ApiConstants.updateProject);
  const refRBSheet = useRef();
  const selectUser = []

  const getAssignee = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      const response = await axios.post(getAssigneeTeam, {
        token: token,
      });
      setAssignee(response.data?.data);
      if (comeFrom === 'Project Update') {
        if(projectInfo[0].project_cordinator_id){
          response.data?.data
        .filter(
          data =>
            data.id.toString() ===
            projectInfo[0].project_cordinator_id.toString(),
        )
        .map(data => {
          setCheckedItems({
            ...checkedItems,
            [data.id]: !checkedItems[data.id],
          });
          searchUser.push({id: data.id, name: data.name});
          setSearchData(searchUser);
          if (selectUser.length > 0) {
            const checkV =
              searchUser.map(e => e === data.id) === checkedItems[data.id];
            if (checkV) {
              return 'checked';
            } else {
              return 'unchecked';
            }
          } else {
            if (checkedItems[data.id]) {
              return 'checked';
            } else {
              return 'unchecked';
            }
          }
        });
        }
      }
      setSearchAssignee(response.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanies = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      const response = await axios.post(getCompanyList, {
        token: token,
        id: user_Id,
      });
      if (response.status === 200) {
        setLoading(false);
        setCompanies(response.data?.data?.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleRemove = id => {
    const remove = searchUser.filter(data => data.id !== id);
    setSearchData(remove);
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

  const createProject = async () => {
    try {
      if (!title) {
        toastMessage(toast, 'Project Title is required');
      } else if (!getComapanySelect) {
        toastMessage(toast, 'Company is required');
      } else if (searchUser.length === 0) {
        toastMessage(toast, 'Project Member is required');
      } else {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const user_Id = await AsyncStorage.getItem('user_id');
        console.log({
          token: token,
          project_id: comeFrom === 'Project Update' && getProjectId,
          id: user_Id,
          project_name: title,
          company_id: getComapanySelect,
          project_cordinator_id: searchUser.map(item => item.id).toString(),
          deadline: getDeadline,
          description: description,
          team_cordinator: teamCoordinator,
        });
        const response = await axios.post(comeFrom === 'Project Update' ? updateProjectUrl : createProjectUrl, {
          token: token,
          id: comeFrom === 'Project Update' && getProjectId,
          project_name: title,
          company_id: getComapanySelect,
          project_cordinator_id: searchUser.map(item => item.id).toString(),
          deadline: getDeadline,
          description: description,
          team_cordinator: teamCoordinator,
        });
        console.log(response.data);
        if (response.status === 200) {
          setLoading(false);
          toastMessage(toast, response.data?.message);
          navigation.navigate('dashboard');
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const updateProjectData = async () => {
    if (comeFrom === 'Project Update') {
      setLoading(true);
      if (projectInfo) {
        setTitle(projectInfo[0]?.project_name);
        setDescription(projectInfo[0]?.description);
        setTaskDeadline(projectInfo[0]?.deadline);
        selectTeamCoordinator(projectInfo[0]?.team_cordinator);
        setCompanySelect(projectInfo[0]?.company_id);
        setProjectId(projectInfo[0]?.id);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getAssignee();
    getCompanies();
    updateProjectData();
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader
        text={comeFrom === 'Project Update' ? 'Update Project' : 'Add Project'}
        navigate={() => navigation.goBack()}
      />
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
        <Label name={'Project title'} margin={10} />
        <TextInput
          value={title}
          placeholder="Enter task title"
          placeholderTextColor={ColorConstants.textLightBlack1}
          style={styles.inputText}
          onChangeText={text => setTitle(text)}
        />
        <Label name={'Company'} margin={10} />
        <DropDownMenu
          data={getComapany}
          placeholder="Select the Company"
          value={getComapanySelect}
          labelField={'company_name'}
          valueField={'id'}
          onChange={value => setCompanySelect(value.id)}
        />
        <AppSize height={10} />
        <Label name={'Project Member'} margin={10} />
        <View
          style={{
            flexDirection: 'column',
          }}>
          {getAssigne.length > 0 && searchUser.length > 0 ? (
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
                {getAssigne.length > 0 ? (
                  <ScrollView
                    contentContainerStyle={{
                      paddingVertical: 10,
                    }}>
                    {getAssigne.map((data, index) => (
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
            </View>
          }
          buttonButton={
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
                  refRBSheet.current.hide();
                }}
              />
            </View>
          }
        />
        <AppSize height={10} />
        <Label name={'Team Coordinator'} margin={10} />
        <DropDownMenu
          data={getAssigne}
          placeholder="Select the Company"
          value={teamCoordinator}
          labelField={'name'}
          valueField={'id'}
          isSearch={true}
          searchPlaceHolder={'Search'}
          onChange={value => selectTeamCoordinator(value.id)}
        />
        <AppSize height={20} />
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
              color={ColorConstants.primaryBlack}
            />
            <AppSize width={10} />
            <Text style={{color: ColorConstants.primaryBlack}}>
              {TimeCondition.monthDate(getDeadline)}
            </Text>
          </TouchableOpacity>
        </View>
        <AppSize height={10} />
        <Label name={'Description'} margin={10} />
        <TextInput
          value={description}
          placeholder="Write description here ..."
          placeholderTextColor={ColorConstants.textLightBlack1}
          style={styles.inputText}
          onChangeText={text => setDescription(text)}
        />
        <AppSize height={20} />
        <AppButton
          text={comeFrom === 'Project Update' ? 'Update Project' : 'Create Project'}
          style={{
            backgroundColor: ColorConstants.buttonGreenColor,
          }}
          onPress={() => createProject()}
        />
        <AppSize height={20} />
      </ScrollView>
      {isLoading && <Loading />}
    </View>
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
  inputText: {
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: ColorConstants.primaryBlack,
    paddingVertical: 15,
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
  bottomButtonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
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
  chipText: {
    color: ColorConstants.primaryBlack,
    fontFamily: 'poppins',
    fontWeight: '700',
    padding: 8,
  },
  cancelButton: {
    borderColor: ColorConstants.primaryBlack,
    borderWidth: 2,
    borderRadius: 100,
    flexDirection: 'row',
    backgroundColor: ColorConstants.primaryBlack,
  },
});

export default CreateProject;
