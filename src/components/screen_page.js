import SignInScreen from '../auth/sign_in';
import SignUpScreen from '../auth/sign_up';
import SplashSreen from '../splash/splash_screen';
import LogoPage from '../splash/logo_page';
import ForgetPassword from '../auth/forget_pass';
import CreatePassword from '../auth/create_pass';
import OtpPage from '../auth/otp_page';
import DashBoard from '../main/dashboard';
import HomeScreen from '../main/tabs/home';
import {MyAssignee, MyTask} from '../main/tabs/my_task';
import ProjectScreen from '../main/tabs/project';
import CompanyScreen from '../main/tabs/company';
import TeamScreen from '../main/tabs/team';
import TeamProfile from '../main/profile/team_profile';
import MyAccount from '../main/profile/my_account';
import EditProfile from '../main/profile/edit_profile';
import NotificationPage from '../main/notification';
import SearchScreen from '../main/searchPage';
import AddTask from '../main/task/add_task';
import CreateProject from '../main/project/create_project';
import CreateCompany from '../main/company/create_company';
import ProjectInfo from '../main/project/project_info';
import CompanyInfo from '../main/company/company_info';
import CreateProfile from '../main/profile/create_new_user';
import TeamTaskScreen from '../main/task/team_task_screen';
import ProjectPageScreen from '../main/project/project_screen';
import TaskDetailsScreen from '../main/task/task_details';
import Approved from './approve';
import ProfileImage from './profile_image';

const screens = [
  {
    name: 'logo_page',
    component: LogoPage,
  },
  {
    name: 'splash',
    component: SplashSreen,
  },
  {
    name: 'sign_up',
    component: SignUpScreen,
  },
  {
    name: 'sign_in',
    component: SignInScreen,
  },
  {
    name: 'forget_pass',
    component: ForgetPassword,
  },
  {
    name: 'create_pass',
    component: CreatePassword,
  },
  {
    name: 'otp_page',
    component: OtpPage,
  },
  {
    name: 'dashboard',
    component: DashBoard,
  },
  {
    name: 'home_page',
    component: HomeScreen,
  },
  {
    name: 'my_task',
    component: MyTask,
  },
  {
    name: 'assignee',
    component: MyAssignee,
  },
  {
    name: 'project_page',
    component: ProjectScreen,
  },
  {
    name: 'company_page',
    component: CompanyScreen,
  },
  {
    name: 'team_page',
    component: TeamScreen,
  },
  {
    name: 'team_profile',
    component: TeamProfile,
  },
  {
    name: 'my_account',
    component: MyAccount,
  },
  {
    name: 'profile_image',
    component: ProfileImage,
  },
  {
    name: 'edit_profile',
    component: EditProfile,
  },
  {
    name: 'notification',
    component: NotificationPage,
  },
  {
    name: 'search',
    component: SearchScreen,
  },
  {
    name: 'add_task',
    component: AddTask,
  },
  {
    name: 'create_project',
    component: CreateProject,
  },
  {
    name: 'create_company',
    component: CreateCompany,
  },
  {
    name: 'project_info',
    component: ProjectInfo,
  },
  {
    name: 'company_info',
    component: CompanyInfo,
  },
  {
    name: 'create_profile',
    component: CreateProfile,
  },
  {
    name: 'team_task_screen',
    component: TeamTaskScreen,
  },
  {
    name: 'project_page_screen',
    component: ProjectPageScreen,
  },
  {
    name: 'task_details_screen',
    component: TaskDetailsScreen,
  },
  {
    name: 'approve',
    component: Approved,
  },
];

export default screens;
