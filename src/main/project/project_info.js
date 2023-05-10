/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Dimensions, Text} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Appbar} from 'react-native-paper';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading} from '../../components/no_data_found';
import {Label, LightText1, LightText} from '../../components/label';
import moment from 'moment';
import {PersonTile, TimeTile} from '../../components/person_tile';
import AppHeader from '../../components/app_header';
import Dividers from '../../components/divider';

const {height, width} = Dimensions.get('screen');

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
    <View style={styles.container}>
      <AppHeader navigate={() => navigation.goBack()} />
      <ScrollView style={{paddingHorizontal: 10}}>
        <View>
          <Label name={projectInfo[0]?.project_name} />
          <LightText1
            lightText1={
              projectInfo[0]?.company[0]?.company_name ?? 'No Company Found'
            }
          />
        </View>
        <PersonTile
          title={'Project Assignee'}
          subTitle={projectInfo[0]?.cordinator_name?.map(
            (data, index) => `${data?.name}, ` ?? 'No name',
          )}
        />
        <PersonTile
          title={'Task Assignee'}
          subTitle={
            projectInfo[0]?.team_cordinator !== '' &&
            projectInfo[0]?.team_cordinator !== null
              ? getUserData.map((data, index) =>
                  data.id === projectInfo[0]?.team_cordinator ? data.name : '',
                )
              : 'No Task Assignee found'
          }
        />
        <TimeTile
          color={ColorConstants.buttonGreenColor}
          label={'Actual DeadLine'}
          time={
            moment(projectInfo[0]?.deadline).format('MMM DD, yyyy') ?? 'date'
          }
        />
        <Dividers h1={0.5} />
        <TimeTile
          color={ColorConstants.primaryColor}
          label={'DeadLine'}
          time={
            moment(projectInfo[0]?.actual_deadline).format('MMM DD, yyyy') ??
            'date'
          }
        />
        <Dividers h1={0.5} />
        <View>
          <Label name={'Description'} />
          <LightText1
            lightText1={projectInfo[0]?.description ?? 'No description found'}
          />
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
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
    // borderColor: color,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  app_bar_header: {
    flex: 1,
    backgroundColor: ColorConstants.primaryWhite,
  },
});

export default ProjectInfo;
