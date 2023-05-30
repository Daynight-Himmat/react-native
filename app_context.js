import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import screens from './src/components/screen_page';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

const AppContext = ({navigation}) => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="logo_page">
        {screens.map((data, index) => (
          <Stack.Screen
            key={index}
            name={data.name}
            component={data.component}
            options={{
              headerShown: false,
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContext;
