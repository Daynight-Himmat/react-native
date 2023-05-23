import React, {useEffect} from 'react';
import AppContext from './app_context';
import { Platform } from 'react-native';
import {ToastProvider} from 'react-native-toast-notifications';
import { firebase } from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';

const App = () => {  

  async function initializeFirebase() {
    await firebase.initializeApp(
      {
      appId: "1:115722538253:ios:86508f76c0c0f457cb7444",
      apiKey: "AIzaSyDnxvKfiBlyFb7jPf0GAy0NaWwf97r7Kas",
      projectId: "project-management-f2ae0",
      messagingSenderId: "115722538253",
      databaseURL: 'https://project-management-f2ae0-default-rtdb.firebaseio.com/'
      }
    );
  }

  useEffect(()=>{
    initializeFirebase();
  },[]);

  return (
    <ToastProvider>
        <AppContext />
    </ToastProvider>
  );
};

export default App;
