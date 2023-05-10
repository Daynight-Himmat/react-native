/* eslint-disable react-native/no-inline-styles */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import ColorConstants from '../constants/color_constants';
import HomeScreen from './tabs/home';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TeamScreen from './tabs/team';
import CompanyScreen from './tabs/company';
import ProjectScreen from './tabs/project';
import Notification from '../../assets/images/notification.svg';
import SearchIcon from '../../assets/images/search.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import {FAB} from 'react-native-paper';
import AddTask from './task/add_task';
import {Loading} from '../components/no_data_found';

const Tab = createBottomTabNavigator();

const DashBoard = ({navigation}) => {
  const [getToken, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [get_user, setUserData] = useState('');
  const [index, setIndex] = useState('');

  const url = BaseUrl(ApiConstants.getUser);

  const checking = async () => {
    try {
      const isLoadIn = await AsyncStorage.getItem('loggedIn');
      setLoading(true);
      const asyncStorageRes = await AsyncStorage.getItem('token');
      await axios
        .post(url, {
          token: asyncStorageRes,
        })
        .then(response => {
          if (response.status === 200) {
            setUserData(response.data?.user);
            AsyncStorage.setItem('user_id', `${response.data?.user.id}`);
            setLoading(false);
            // console.log(response.data);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      checking();
    }, 10);
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: ColorConstants.primaryColor,
          tabBarInactiveTintColor: ColorConstants.textLightBlack1,
          tabBarShowLabel: false,
        }}
        screenListeners={{
          state: e => {
            setIndex(e.data.state.index);
            // console.log('state changed', e.data.state.index);
          },
        }}>
        <Tab.Screen
          name="home_page"
          component={HomeScreen}
          options={{
            headerShown: true,
            headerTitle: `Hi ${get_user.name}`,
            headerTitleStyle: styles.headerTitleStyle,
            headerBackTitle: 'Back',
            headerRight: () => (
              <View style={styles.iconList}>
                {get_user.role_id === 1 ? (
                  <TouchableOpacity onPress={() => {}}>
                    <Feather name={'mail'} color={'black'} size={20} />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
                <View
                  style={{
                    paddingHorizontal: 5,
                  }}
                />
                <Feather name={'download'} color={'black'} size={20} />
                <View
                  style={{
                    paddingHorizontal: 5,
                  }}
                />
                <TouchableOpacity onPress={() => navigation.navigate('search')}>
                  <SearchIcon height={20} width={20} />
                </TouchableOpacity>
                <View
                  style={{
                    paddingHorizontal: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('notification')}>
                  <Notification height={20} width={20} />
                </TouchableOpacity>
                <View
                  style={{
                    paddingHorizontal: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('my_account', {
                      data: get_user,
                    });
                  }}>
                  <View style={styles.imageContainer}>
                    {get_user.profile_image != null &&
                    get_user.profile_image.split('.').pop() === 'jpg' ? (
                      <Image
                        style={styles.imageContainer}
                        source={{uri: get_user.profile_image}}
                      />
                    ) : (
                      <Ionicons
                        name={'person-sharp'}
                        size={10}
                        style={styles.image}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ),
            tabBarIcon: ({color, size}) => (
              <Foundation name={'home'} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="project_page"
          component={ProjectScreen}
          options={{
            title: ({color}) => <Text style={{color: color}}> Project </Text>,
            headerShown: true,
            headerTitle: 'Project',
            headerTitleStyle: styles.headerTitleStyle,
            tabBarIcon: ({color, size}) => (
              <Ionicons name={'ios-grid'} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="add_task"
          component={AddTask}
          Listeners={{
            state: e => {
              setIndex(e.data.state.index);
            },
          }}
          options={{
            tabBarButton: () => (
              <FAB
                icon="plus"
                color="#FFFFFF"
                onPress={() => {
                  switch (index) {
                    case 0:
                      return navigation.navigate('add_task', {
                        data: [],
                        comeFrom : 'create_Task'
                      });
                    case 1:
                      return navigation.navigate('create_project');
                    case 3:
                      return navigation.navigate('create_company', {
                        companyData: [],
                        comeFrom: 'Company Create',
                      });
                    case 4:
                      return navigation.navigate('create_profile');
                    default:
                      console.log('this data');
                  }
                }}
                style={styles.fab_style}
              />
            ),
          }}
        />

        <Tab.Screen
          name="company_page"
          component={CompanyScreen}
          options={{
            title: ({color}) => <Text style={{color: color}}> Team </Text>,
            headerShown: true,
            headerTitle: 'Company',
            headerTitleStyle: styles.headerTitleStyle,
            tabBarIcon: ({color, size}) => (
              <Ionicons name={'business'} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="team_page"
          component={TeamScreen}
          options={{
            headerShown: true,
            headerTitle: 'Team',
            headerTitleStyle: styles.headerTitleStyle,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name={'group'} size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
    flexDirection: 'column',
    elevation: 10,
  },
  headerTitleStyle: {fontSize: 17, fontWeight: '600'},
  lite: {
    height: 60,
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 24,
    width: 24,
    borderRadius: 100,
    backgroundColor: ColorConstants.textHintColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  image: {
    color: ColorConstants.primaryWhite,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorConstants.primaryBlack,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.teamHiColor,
  },
  divider: {
    height: 0.6,
    width: '100%',
    backgroundColor: ColorConstants.textLightBlack3,
  },
  fab_style: {
    backgroundColor: ColorConstants.primaryColor,
    borderRadius: 100,
    position: 'relative',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 25,
    zIndex: 999,
    color: ColorConstants.primaryWhite,
  },
  iconList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

export default DashBoard;
