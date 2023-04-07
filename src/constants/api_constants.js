const BaseUrl = end_Point => `http://143.110.190.217/api/${end_Point}`;

const BaseUrl1 = end_Point => `https://pm.ankitsisodiya.com/api/${end_Point}`;

const CompanyProfileImage = () =>
  'http://143.110.190.217/Company/profile_pictures/';

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
  static addList = 'AddTask';
  static taskAssignList = 'TaskListAssignee';
  static changePriority = 'ChangePriority';
  static changeTaskStatus = 'ChangeTaskStatus';
  static changeTaskDelete = 'ChangeTaskDelete';
  static changeTaskAssignee = 'ChangeTaskAssignee';
  static createProject = 'AddProject';
  static companyList = 'CompanyList';
  static companyEdit = 'AddCompany';
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

export {BaseUrl, BaseUrl1, CompanyProfileImage, ApiConstants};
