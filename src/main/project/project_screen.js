import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Appbar, Text} from 'react-native-paper';
import {InnerTab} from '../../components/tabs';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading, NoData} from '../../components/no_data_found';
import TaskTile from '../../components/task_tile';
import {Feather} from '../../components/icons';
import movement from 'moment';

const ProjectPageScreen = ({navigation, route}) => {
  const {data} = route.params;
  const [innerSide, setInnerSide] = useState('All');
  const [isLoading, setLoading] = useState(false);
  const [projectsTaskList, setProjectsTaskList] = useState([]);
  const projectTaskListUrl = BaseUrl(ApiConstants.projectTaskList);
  var currentDate = new movement().format('MMM DD, yyyy');

  const getProjectsTaskList = async ({type}) => {
    
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(projectTaskListUrl, {
        token: token,
        id: data.id,
      });

      console.log(response.data);
      setProjectsTaskList(response.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getProjectsTaskList();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.app_bar_header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={data.project_name}
          color={ColorConstants.primaryBlack}
          titleStyle={styles.app_bar_title}
        />
        <Appbar.Action
          icon="information-outline"
          color={ColorConstants.primaryColor}
          onPress={() => {
            navigation.navigate('project_info', {
              project_id: data.id,
            });
          }}
        />
        <Appbar.Action
          icon="shape-square-plus"
          color={ColorConstants.primaryBlack}
          onPress={() => {
            navigation.navigate('add_task');
          }}
        />
      </Appbar.Header>
      <View style={styles.inner_tab_view_style}>
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
            getProjectsTaskList('All');
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
            getProjectsTaskList('today');
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
            getProjectsTaskList('due');
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
            getProjectsTaskList('complete');
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
        }}>
        {projectsTaskList.length > 0 ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            {projectsTaskList.map((data, index) =>
              innerSide === 'All' ? (
                data.task_status === 'Active' ? (
                  <TaskTile
                    key={data.title}
                    data={data}
                    index={index}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: data,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : innerSide === 'today' ? (
                movement(data.actual_deadline).format('MMM DD, yyyy') ===
                  currentDate && data.task_status === 'Active' ? (
                  <TaskTile
                    key={data.title}
                    data={data}
                    index={index}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: data,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : innerSide === 'due' ? (
                movement(data.actual_deadline).format('MMM DD, yyyy') !==
                  currentDate && data.task_status === 'Active' ? (
                  <TaskTile
                    key={data.title}
                    data={data}
                    index={index}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: data,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : innerSide === 'complete' ? (
                data.task_status === 'Completed' ? (
                  <TaskTile
                    key={data.title}
                    data={data}
                    index={index}
                    onPress={() => {
                      navigation.navigate('task_details_screen', {
                        data: data,
                      });
                    }}
                  />
                ) : (
                  <View />
                )
              ) : (
                <View key={data.title}>
                  <Text
                    style={{
                      color: ColorConstants.primaryBlack,
                    }}>
                    {movement(data.actual_deadline).format('MMM DD, yyyy')}
                  </Text>
                </View>
              ),
            )}
          </ScrollView>
        ) : (
          <NoData />
        )}
      </View>
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: ColorConstants.primaryWhite,
  },
  app_bar_header: {
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
  },
  app_bar_title: {
    fontWeight: '700',
    fontSize: 17,
  },
  inner_tab_view_style: {
    height: 30,
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});

export default ProjectPageScreen;
