import React, {useEffect, useState, useRef} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Label} from '../../components/label';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/app_button';
import AppSize from '../../components/size';
import RBSheet from 'react-native-raw-bottom-sheet';
import TeamScreen from '../tabs/team';

const CreateProject = () => {
  const [checked, setChecked] = useState('first');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState([]);
  const [assignee, setAssignee] = useState([]);
  const [priority, setPriority] = useState('');
  const [getProject, selectProject] = useState('');
  const [getAssign, selectAssignee] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const url = BaseUrl(ApiConstants.myProjectList);
  const url1 = BaseUrl(ApiConstants.projectWiseMember);
  const refRBSheet = useRef();

  const checking = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user_Id = await AsyncStorage.getItem('user_id');
      console.log({userId: user_Id, token: token});
      const response = await axios.post(url, {
        token: token,
        id: user_Id,
      });
      setProject(response.data.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAssignee = async ({id: project_id}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(url1, {
        token: token,
        project_id: project_id,
      });
      setAssignee(response.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checking();
  }, []);

  return (
    <View style={styles.container}>
      <Label name={'Project title'} />
      <TextInput
        placeholder="Enter task title"
        placeholderTextColor={ColorConstants.textLightBlack1}
        style={styles.inputText}
      />
      <Label name={'Company'} />
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
          getAssignee({id: id});
        }}
        search={false}
        notFoundText={'No Project Found'}
        dropdownTextStyles={styles.dropdownTextStyles}
        placeholder={getProject !== '' ? getProject : 'select the company name'}
        inputStyles={[
          styles.inputStyles,
          {
            color:
              getProject !== ''
                ? ColorConstants.primaryBlack
                : ColorConstants.textLightBlack1,
          },
        ]}
        onSelect={() => {
          console.log('---get Project', getProject);
        }}
        fontFamily={'400'}
        color={ColorConstants.primaryBlack}
        placeholderTextColor={ColorConstants.textLightBlack1}
        boxStyles={styles.boxStyles}
      />
      <AppSize height={10} />
      <Label name={'Project Member'} />
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
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <TeamScreen />
        </View>
      </RBSheet>
      <AppSize height={10} />
      <Label name={'Team Coordinator'} />
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
          getAssignee({id: id});
        }}
        search={false}
        notFoundText={'No Project Found'}
        dropdownTextStyles={styles.dropdownTextStyles}
        placeholder={
          getProject !== '' ? getProject : 'Select the team-coordinator'
        }
        inputStyles={[
          styles.inputStyles,
          {
            color:
              getProject !== ''
                ? ColorConstants.primaryBlack
                : ColorConstants.textLightBlack1,
          },
        ]}
        onSelect={() => {
          console.log('---get Project', getProject);
        }}
        fontFamily={'400'}
        color={ColorConstants.primaryBlack}
        placeholderTextColor={ColorConstants.textLightBlack3}
        boxStyles={styles.boxStyles}
      />
      <AppSize height={20} />
      <View style={styles.date_container}>
        <View style={styles.flex}>
          <Label name={'DeadLine'} />
        </View>
        <TouchableOpacity style={styles.date_picker}>
          <Ionicons name={'calendar'} color={ColorConstants.textLightBlack1} />
          <AppSize width={10} />
          <Text style={{color: ColorConstants.textLightBlack1}}>
            Jan 30, 2023
          </Text>
        </TouchableOpacity>
      </View>
      <AppSize height={10} />
      <Label name={'Description'} />
      <TextInput
        placeholder="Write description here ..."
        multiline={true}
        maxLength={4}
        placeholderTextColor={ColorConstants.textLightBlack1}
        style={styles.inputText}
      />
      <AppSize height={20} />
      <AppButton
        text={'Create Project'}
        style={{
          backgroundColor: ColorConstants.buttonGreenColor,
        }}
        onPress={() => {}}
      />
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
});

export default CreateProject;
