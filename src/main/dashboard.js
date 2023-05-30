/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import HomeScreen from './tabs/home';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TeamScreen from './tabs/team';
import CompanyScreen from './tabs/company';
import ProjectScreen from './tabs/project';
import {FAB} from 'react-native-paper';
import AddTask from './task/add_task';
import FontConstants from '../constants/fonts';

const Tab = createBottomTabNavigator();

const DashBoard = ({navigation}) => {
  const [index, setIndex] = useState('');

  const fabButton = () => {
    return (
      <FAB
        icon="plus"
        color="#FFFFFF"
        onPress={() => {
          switch (index) {
            case 0:
              return navigation.navigate('add_task', {
                data: [],
                comeFrom: 'create_Task',
              });
            case 1:
              return navigation.navigate('create_project', {
                comeFrom: 'Project Create',
                projectInfo: [],
              });
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
    );
  };

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
          tabBarStyle: {
            elevation: 0,
            shadowOffset: {
              width: 0,
              height: 0,
            },
          },
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
            headerShown: false,
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
            headerShadowVisible: false,
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
            tabBarButton: () => fabButton,
          }}
        />

        <Tab.Screen
          name="company_page"
          component={CompanyScreen}
          options={{
            title: ({color}) => <Text style={{color: color}}> Team </Text>,
            headerShown: true,
            headerTitle: 'Company',
            headerShadowVisible: false,
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
            headerShadowVisible: false,
            headerTitle: 'Team',
            headerTitleStyle: styles.headerTitleStyle,
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name={'group'} size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
    flexDirection: 'column',
    elevation: 10,
  },
  headerTitleStyle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: FontConstants.semiBold,
  },
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
