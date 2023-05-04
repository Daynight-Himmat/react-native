import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import FontConstants from '../../constants/fonts';
import ColorConstants from '../../constants/color_constants';
import TaskTile from '../../components/task_tile';
import {ScrollView} from 'react-native-gesture-handler';
import {NoData} from '../../components/no_data_found';

const MyTaskTab = createMaterialTopTabNavigator();
const MyAssigneeTab = createMaterialTopTabNavigator();

const MyTask = ({getTaskData}) => {
  return (
    <MyTaskTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: 'none',
          fontSize: 12,
          fontFamily: FontConstants.ragular,
          fontWeight: '700',
        },
        tabBarInactiveTintColor: ColorConstants.greyColor,
        tabBarActiveTintColor: ColorConstants.primaryColor,
        tabBarPressColor: ColorConstants.primaryWhite,
      }}>
      <MyTaskTab.Screen
        name="All"
        component={AllTask}
        initialParams={getTaskData}
      />
      <MyTaskTab.Screen
        name="Today"
        component={TodayTask}
        initialParams={getTaskData}
      />
      <MyTaskTab.Screen
        name="Due"
        component={DueTask}
        initialParams={getTaskData}
      />
      <MyTaskTab.Screen
        name="Complete"
        component={CompleteTask}
        initialParams={getTaskData}
      />
    </MyTaskTab.Navigator>
  );
};

const MyAssignee = ({route}) => {
  return (
    <MyAssigneeTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: 'none',
          fontSize: 12,
          fontFamily: FontConstants.ragular,
          fontWeight: '700',
        },
        tabBarInactiveTintColor: ColorConstants.greyColor,
        tabBarActiveTintColor: ColorConstants.primaryColor,
        tabBarPressColor: ColorConstants.primaryWhite,
      }}>
      <MyAssigneeTab.Screen
        name="All"
        component={AllTask}
        initialParams={route}
      />
      <MyAssigneeTab.Screen
        name="Today"
        component={TodayTask}
        initialParams={route}
      />
      <MyAssigneeTab.Screen
        name="Due"
        component={DueTask}
        initialParams={route}
      />
      <MyAssigneeTab.Screen
        name="Complete"
        component={CompleteTask}
        initialParams={route}
      />
    </MyAssigneeTab.Navigator>
  );
};

const AllTask = ({route, navigation}) => {
  console.log({route: route.params});
  const getData = route.params;
  return (
    <ScrollView>
      {route.length > 0 ? (
        route.map((data, index) => (
          <TaskTile
            data={data}
            index={index}
            onPress={() => {
              navigation.navigate('task_details_screen', {
                data: data,
              });
            }}
          />
        ))
      ) : (
        <NoData />
      )}
    </ScrollView>
  );
};

const TodayTask = ({route, navigation}) => {
  console.log({route: route.params});
  return (
    <ScrollView>
      <TaskTile
        data={route.params}
        // index={index}
        onPress={() => {
          navigation.navigate('task_details_screen', {
            data: route.params,
          });
        }}
      />
    </ScrollView>
  );
};

const DueTask = ({route, navigation}) => {
  console.log({route: route.params});
  return (
    <ScrollView>
      <TaskTile
        data={route.params}
        // index={index}
        onPress={() => {
          navigation.navigate('task_details_screen', {
            data: route.params,
          });
        }}
      />
    </ScrollView>
  );
};
const CompleteTask = ({route, navigation}) => {
  const routes = route.params;

  console.log({routes: routes});
  return <ScrollView />;
};

export {MyTask, MyAssignee};
