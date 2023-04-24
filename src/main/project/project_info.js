import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Appbar} from 'react-native-paper';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading} from '../../components/no_data_found';
import {Label, LightText1} from '../../components/label';
import moment from 'moment';
import {TimeTile} from '../../components/person_tile';

const ProjectInfo = ({navigation, route}) => {
  const {project_id} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState([]);
  const [getUserData, setUserData] = useState([]);
  const projectInfoUrl = BaseUrl(ApiConstants.projectDetails);
  const get_user = BaseUrl(ApiConstants.getUserList);

  const getProjectInfo = async () => {
    try {
      setLoading(true);
      console.log(project_id);
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(projectInfoUrl, {
          token: token,
          id: project_id,
        })
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            console.log(response.data?.data);
            setProjectInfo(response.data?.data);
            // const date = projectInfo[0]?.deadline;
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
      await axios
        .post(get_user, {
          token: token,
        })
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            setUserData(response.data?.data);
            for (var i = 0; i < getUserData.length; i++) {
              if (projectInfo[0]?.team_cordinator !== '') {
                if (projectInfo[0]?.team_cordinator === getUserData[i].id) {
                  console.log(getUserData[i].name);
                }
              } else {
                console.log('null');
              }
            }
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectInfo();
  }, []);

  return (
    <View style={styles(ColorConstants.primaryWhite).container}>
      <Appbar.Header style={styles.app_bar_header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={''}
          color={ColorConstants.primaryBlack}
          titleStyle={{
            fontWeight: '700',
            fontSize: 17,
          }}
        />
        <Appbar.Action
          icon="pencil"
          size={20}
          color={ColorConstants.primaryBlack}
          onPress={() => {}}
        />
        <Appbar.Action
          icon="delete-outline"
          size={20}
          color={ColorConstants.highLightColor}
          onPress={() => {}}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <Label name={projectInfo[0]?.project_name} />
          <LightText1
            lightText1={
              projectInfo[0]?.company[0]?.company_name ?? 'No Company Found'
            }
          />
        </View>
        <TimeTile
          type={'person'}
          color={ColorConstants.primaryColor}
          time={projectInfo[0]?.cordinator_name?.map(
            (data, index) => `${data?.name}, ` ?? 'No name',
          )}
          label={'Project Assignee'}
        />
        <TimeTile
          type={'person'}
          color={ColorConstants.primaryColor}
          time={
            projectInfo[0]?.team_cordinator !== '' &&
            projectInfo[0]?.team_cordinator !== null
              ? getUserData.map((data, index) =>
                  data.id === projectInfo[0]?.team_cordinator ? data.name : '',
                )
              : 'No Task Assignee found'
          }
          label={'Task Assignee'}
        />
        <TimeTile
          type={'date'}
          color={ColorConstants.buttonGreenColor}
          label={'Actual DeadLine'}
          time={
            moment(projectInfo[0]?.deadline).format('MMM DD, yyyy') ?? 'date'
          }
        />
        <TimeTile
          type={'date'}
          color={ColorConstants.primaryColor}
          label={'DeadLine'}
          time={
            moment(projectInfo[0]?.actual_deadline).format('MMM DD, yyyy') ??
            'date'
          }
        />
        <View
          style={{
            flexDirection: 'column',
          }}>
          <Label name={'Description'} />
          <LightText1
            lightText1={projectInfo[0]?.description ?? 'No Description'}
          />
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </View>
  );
};

const styles = color =>
  StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      backgroundColor: ColorConstants.primaryWhite,
    },
    column: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignContent: 'center',
    },
    row: {
      flexDirection: 'row',
      paddingVertical: 10,
      alignItems: 'center',
    },
    calenderStyle: {
      height: 40,
      width: 40,
      borderWidth: 1,
      borderColor: color,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    app_bar_header: {
      width: '100%',
      backgroundColor: ColorConstants.primaryWhite,
    },
  });

export default ProjectInfo;
