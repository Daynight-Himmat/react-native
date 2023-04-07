import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignUpScreen from './src/auth/sign_up';
import SignInScreen from './src/auth/sign_in';
import SplashSreen from './src/splash/splash_screen';
import HomeScreen from './src/main/tabs/home';
import ProjectScreen from './src/main/tabs/project';
import CompanyScreen from './src/main/tabs/company';
import TeamScreen from './src/main/tabs/team';
import DashBoard from './src/main/dashboard';
import TeamProfile from './src/main/profile/team_profile';
import MyAccount from './src/main/profile/my_account';
import EditProfile from './src/main/profile/edit_profile';
import NotificationPage from './src/main/notification';
import SearchScreen from './src/main/searchPage';
import AddTask from './src/main/task/add_task';
import CreateProject from './src/main/project/create_project';
import CreateCompany from './src/main/company/create_company';
import ProjectInfo from './src/main/project/project_info';
import CompanyInfo from './src/main/company/company_info';
import CreateProfile from './src/main/profile/create_new_user';
import ColorConstants from './src/constants/color_constants';
import ProjectPageScreen from './src/main/project/project_screen';
import LogoPage from './src/splash/logo_page';
import ForgetPassword from './src/auth/forget_pass';
import OtpPage from './src/auth/otp_page';
import CreatePassword from './src/auth/create_pass';
import TeamTaskScreen from './src/main/task/team_task_screen';
import TaskDetailsScreen from './src/main/task/task_details';
import {MyTask, Assignee} from './src/main/tabs/my_task';

const Stack = createNativeStackNavigator();

const AppContext = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="logo_page">
        <Stack.Screen
          name="logo_page"
          component={LogoPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="splash"
          component={SplashSreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign_up"
          component={SignUpScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign_in"
          component={SignInScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forget_pass"
          component={ForgetPassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="create_pass"
          component={CreatePassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="otp_page"
          component={OtpPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dashboard"
          component={DashBoard}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="home_page"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="my_task"
          component={MyTask}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="assignee"
          component={Assignee}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="project_page"
          component={ProjectScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="company_page"
          component={CompanyScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="team_page"
          component={TeamScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="team_profile"
          component={TeamProfile}
          options={{
            headerShown: true,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="my_account"
          component={MyAccount}
          options={{
            headerShown: true,
            headerTitle: 'My Account',
            headerTitleAlign: 'center',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              fontSize: 17,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="edit_profile"
          component={EditProfile}
          options={{
            headerShown: true,
            headerTitle: 'My Account',
            headerTitleAlign: 'center',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              fontSize: 17,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="notification"
          component={NotificationPage}
          options={{
            headerShown: true,
            headerTitle: 'Notification',
            headerTitleAlign: 'center',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              fontSize: 17,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="search"
          component={SearchScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add_task"
          component={AddTask}
          options={{
            headerShown: true,
            headerTitle: 'Add Task',
            headerTitleStyle: {
              fontSize: 18,
              color: ColorConstants.primaryBlack,
            },
          }}
        />
        <Stack.Screen
          name="create_project"
          component={CreateProject}
          options={{
            headerShown: true,
            headerTitle: 'Create Project',
            headerTitleStyle: {
              fontSize: 18,
              color: ColorConstants.primaryBlack,
            },
          }}
        />
        <Stack.Screen
          name="create_company"
          component={CreateCompany}
          options={{
            headerShown: true,
            headerTitle: 'Create Company',
            headerTitleStyle: {
              fontSize: 18,
              color: ColorConstants.primaryBlack,
            },
          }}
        />
        <Stack.Screen
          name="project_info"
          component={ProjectInfo}
          options={{
            headerShown: false,
            headerTitleStyle: {
              fontSize: 18,
              color: ColorConstants.primaryBlack,
            },
          }}
        />
        <Stack.Screen
          name="company_info"
          component={CompanyInfo}
          options={{
            headerShown: false,
            headerTitle: 'Company Profile',
            headerTitleStyle: {
              fontSize: 18,
              color: ColorConstants.primaryBlack,
            },
          }}
        />
        <Stack.Screen
          name="create_profile"
          component={CreateProfile}
          options={{
            headerShown: true,
            headerTitle: 'Create Profile',
            headerTitleStyle: {
              fontSize: 18,
              color: ColorConstants.primaryBlack,
            },
          }}
        />
        <Stack.Screen
          name="team_task_screen"
          component={TeamTaskScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="project_page_screen"
          component={ProjectPageScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="task_details_screen"
          component={TaskDetailsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContext;
