const BaseUrl = end_Point => `http://143.110.190.217/api/${end_Point}`;

const BaseUrl1 = end_Point => `https://pm.ankitsisodiya.com/api/${end_Point}`;

const CompanyProfileImage = end_Point =>
  `http://143.110.190.217/public/Company/profile_pictures/${end_Point}`;

const ProfileImage = end_Point =>
  `http://143.110.190.217/public/storage/${end_Point}`;

const TaskImage = end_Point =>
  `http://143.110.190.217/public/task_images/${end_Point}`;

const TaskIssueImage = end_Point =>
  `http://143.110.190.217/public/task_issue_images/${end_Point}`;

const TaskChatImage = end_Point =>
  `http://143.110.190.217/public/task_chat_images/${end_Point}`;

class ApiConstants {
  static signUp = 'sendOtp';
  static verifyOtp = 'verifyOtp';
  static registration = 'register';
  static logIn = 'login';
  static logOut = 'logout';
  static getUser = 'get_user';
  static myTaskList = 'TaskList';
  static myTeamTaskList = 'userTasks';
  static myProjectList = 'ProjectList';
  static addTask = 'AddTask';
  static taskAssignList = 'TaskListAssignee';
  static changePriority = 'ChangePriority';
  static changeTaskStatus = 'ChangeTaskStatus';
  static changeTaskDelete = 'ChangeTaskDelete';
  static changeTaskAssignee = 'ChangeTaskAssignee';
  static createProject = 'AddProject';
  static companyList = 'CompanyList';
  static addCompany = 'AddCompany';
  static updateCompany = 'UpdateCompany';
  static projectSearch = 'SearchProject';
  static companySearch = 'SearchCompany';
  static teamSearch = 'SearchTeam';
  static taskSearch = 'SearchTasks';
  static taskSorting = 'SortingTasks';
  static projectTaskList = 'ProjectTaskList';
  static getUserList = 'GetUserList';
  static updateUserData = 'updateUser';
  static taskDetails = 'TaskDetails';
  static companyDetails = 'DetailsCompany';
  static projectDetails = 'DetailsProject';
  static updateUserPassword = 'updateUserPassword';
  static taskImageIssue = 'TaskIssue';
  static taskComments = 'TaskCommentsAdd';
  static taskGetComments = 'TaskGetComments';
  static getNotifications = 'AppNotification';
  static taskGetIssues = 'TaskGetIssues';
  static updateProject = 'updateProject';
  static destroyProject = 'destroyProject';
  static destroyCompany = 'destroyCompany';
  static destroyTask = 'destroyTask';
  static destroyUser = 'destroyUser';
  static companyProjectList = 'projectListCompanyWise';
  static getValueAndUpdateToApp = 'getValueAndUpdateToApp';
  static taskUpdate = 'TaskUpdate';
  static taskEditPermission = 'UpdatePermision';
  static revisedTaskDeadline = 'revisedTaskDeadline';
  static revisedProjectDeadline = 'revisedProjectDeadline';
  static projectWiseMember = 'ProjectWiseMember';
  static projectEmailWise = 'ProjectWiseTaskEmail';
  static appVersion = 'app_verion';
}

export {
  BaseUrl,
  BaseUrl1,
  CompanyProfileImage,
  ApiConstants,
  ProfileImage,
  TaskIssueImage,
  TaskImage,
  TaskChatImage,
};
