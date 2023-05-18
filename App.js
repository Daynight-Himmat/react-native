import React from 'react';
import AppContext from './app_context';
import {ToastProvider} from 'react-native-toast-notifications';

const App = () => {
  return (
    <ToastProvider>
        <AppContext />
    </ToastProvider>
  );
};

export default App;
