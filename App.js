import React from 'react';
import AppContext from './app_context';
import {ToastProvider} from 'react-native-toast-notifications';
import {AxiosInterceptor} from './src/components/interceptor';

const App = () => {
  return (
    <ToastProvider>
      <AxiosInterceptor>
        <AppContext />
      </AxiosInterceptor>
    </ToastProvider>
  );
};

export default App;
