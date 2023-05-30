import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import {CommonActions} from '@react-navigation/native';

const changePriorityUrl = BaseUrl(ApiConstants.changePriority);
const completeTaskUrl = BaseUrl(ApiConstants.changeTaskStatus);
const deleteTaskUrl = BaseUrl(ApiConstants.changeTaskDelete);
const taskListUrl = BaseUrl(ApiConstants.myTeamTaskList);

class CommanFunctions {
  static routing = (
    navigation: {dispatch: (arg0: CommonActions.Action) => any},
    route: string,
  ) =>
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: route}],
      }),
    );

  static getCompleteTask = async (task_status: any, taskId: any) => {
    try {
      var asyncStorage = await AsyncStorage.getItem('token');
      var user_id = await AsyncStorage.getItem('user_id');
      const response = await axios.post(completeTaskUrl, {
        token: asyncStorage,
        id: user_id,
        task_id: taskId,
        task_status: task_status,
      });
      return response;
    } catch (error) {}
  };

  static emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  static validateEmail = (validEmail: string) =>
    this.emailRegex.test(validEmail);
  static getChangePriority = async (taskId: any, priority: any) => {
    try {
      var asyncStorage = await AsyncStorage.getItem('token');
      var user_id = await AsyncStorage.getItem('user_id');
      const resposne = await axios.post(changePriorityUrl, {
        token: asyncStorage,
        id: user_id,
        task_id: taskId,
        priority: priority,
      });
      return resposne;
    } catch (error) {}
  };

  static getDeleteTask = async (taskId: any) => {
    try {
      var asyncStorage = await AsyncStorage.getItem('token');
      var user_id = await AsyncStorage.getItem('user_id');
      const response = await axios.post(deleteTaskUrl, {
        token: asyncStorage,
        id: user_id,
        task_id: taskId,
      });
      return response;
    } catch (error) {}
  };

  static getUserTaskData = async (userId: any) => {
    try {
      var token = await AsyncStorage.getItem('token');
      const response = await axios.post(taskListUrl, {
        token: token,
        id: userId,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };
}

export default CommanFunctions;
