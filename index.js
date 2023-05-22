/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initialization} from '@react-native-firebase/app';

initialization();

AppRegistry.registerComponent(appName, () => App);
