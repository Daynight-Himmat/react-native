/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import ColorConstants from './src/constants/color_constants';

PushNotification.configure({

  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  onNotification: function (notification) {
    console.log("NOTIFICATION: onNot", notification);
    PushNotification.localNotification({
      channelId: notification.channelId, 
      showWhen: true, 
      autoCancel: true, 
      color: ColorConstants.primaryWhite, 
      vibrate: true, 
      vibration: 300,
      ongoing: true,
      priority: "high", 
      messageId: notification.id, 
      invokeApp: true, 
      id: notification.id, 
      title: "Project Management", 
      message: notification.message, 
      playSound: true,
      soundName: "default", 
    });
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION: onAc", notification);
  },
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
});

// Check whether an initial notification is available
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );// e.g. "Settings"
    }
  });

AppRegistry.registerComponent(appName, () => App);
