import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ApiConstants, BaseUrl, BaseUrl1} from '../constants/api_constants';

const changePriorityUrl = BaseUrl1(ApiConstants.changePriority);
const completeTaskUrl = BaseUrl1(ApiConstants.changeTaskStatus);
const deleteTaskUrl = BaseUrl1(ApiConstants.changeTaskDelete);
const taskListUrl = BaseUrl(ApiConstants.myTeamTaskList);

class CommanFunctions {
  static getCompleteTask = async (task_status, taskId) => {
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

  static getChangePriority = async (taskId, priority) => {
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

  static getDeleteTask = async taskId => {
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

  static getUserTaskData = async ({id: userId}) => {
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
