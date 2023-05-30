import React from 'react';
import AppContext from './app_context';
import {ToastProvider} from 'react-native-toast-notifications';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AppContext />
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default App;
