import React, {FunctionComponent, createRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {TexTButton} from '../components/text_button';
import ColorConstants from '../constants/color_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataManager from '../constants/static_data';
import AppButton from '../components/app_button';
import toastMessage from '../components/toast_message';
import {MaterialIcons} from '../components/icons';
import AuthImage from '../components/auth_image';
import AppSize from '../components/size';
import {HighLightLabel} from '../components/label';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import {Loading} from '../components/no_data_found';
import {useToast} from 'react-native-toast-notifications';
import {CommonActions} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/messaging';
import CommanFunctions from '../components/comman_functions';
import axiosInstance from '../components/interceptor';

type Props = {
  navigation: any;
};

const SignInScreen: FunctionComponent<Props> = ({navigation}) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [password, setpassword] = useState('');
  const [getFCMToken, setFCMToken] = useState('');
  const [visibility, setVisibility] = useState(true);

  const emailFocus = createRef<TextInput>();
  const passwordFocus = createRef<TextInput>();

  const logInUrl = BaseUrl(ApiConstants.logIn);

  async function registerAndRetrieveFirebaseToken() {
    try {
      const token = await firebase.messaging().getToken();

      if (token) {
        setFCMToken(token);
      }
    } catch (error) {
      console.log('Error retrieving Firebase token:', error);
    }
  }

  const getUserLogIn = async () => {
    try {
      if (!email && !password) {
        toastMessage(toast, 'Please fill the required');
      } else if (!email) {
        toastMessage(toast, 'Please Enter the email');
      } else if (CommanFunctions.validateEmail(email) === false) {
        toastMessage(toast, 'Please Enter Valid the email');
      } else if (!password) {
        toastMessage(toast, 'Please Enter the Password');
      } else {
        setLoading(true);

        const response = await axiosInstance.post(logInUrl, {
          email: email,
          password: password,
          firebase_token: getFCMToken,
        });
        if (response.status === 200) {
          if (response.data.success === true) {
            DataManager.token = response.data.token;
            AsyncStorage.setItem('token', response.data.token);
            AsyncStorage.setItem('isFirstTime', 'true');
            setLoading(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'dashboard',
                    params: {
                      token: response.data.token,
                    },
                  },
                ],
              }),
            );
            toastMessage(toast, 'User Log In Successfully');
          } else {
            setLoading(false);
            toastMessage(toast, 'Something went wrong, please try again');
          }
        } else {
          setLoading(false);
          console.log('..............', response.data);
          console.log(response.data);
        }
        console.log(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      toastMessage(
        toast,
        error.response?.data?.message ?? 'Something went wrong',
      );
    }
  };

  useEffect(() => {
    registerAndRetrieveFirebaseToken();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <AppSize height={20} width={undefined} />
          <AuthImage image={require('../../assets/images/sign_in.png')} />
          <HighLightLabel hightLightLabel={'Sign In'} />
          <AppSize height={20} width={undefined} />
          <View style={styles.textInputView}>
            <TextInput
              value={email}
              cursorColor={ColorConstants.primaryColor}
              style={styles.textInput}
              returnKeyType={'next'}
              ref={emailFocus}
              placeholder="Enter your email address"
              placeholderTextColor={ColorConstants.textHintColor}
              onSubmitEditing={() => passwordFocus.current?.focus()}
              onChangeText={value => setEmail(value)}
            />
          </View>
          <AppSize height={20} width={undefined} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              secureTextEntry={visibility}
              ref={passwordFocus}
              placeholder="Enter your password"
              placeholderTextColor={ColorConstants.textHintColor}
              onChangeText={value => setpassword(value)}
            />
            <TouchableOpacity
              onPress={() => {
                setVisibility(!visibility);
              }}>
              <MaterialIcons
                name={visibility ? 'visibility' : 'visibility-off'}
                size={20}
                color={ColorConstants.textHintColor}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>
          <AppSize height={2} width={undefined} />
          <TexTButton
            onPressText={'Forget Password ?'}
            align={'flex-end'}
            callBack={() => {
              navigation.navigate('forget_pass');
            }}
            infoText={''}
          />
          <AppSize height={2} width={undefined} />
          <AppButton
            onPress={() => getUserLogIn()}
            text={'LogIn'}
            style={undefined}
            textStyle={undefined}
          />
          <AppSize height={20} width={undefined} />
          <TexTButton
            infoText={"Don't have an account"}
            onPressText={'SignUp'}
            callBack={() => {
              navigation.navigate('sign_up');
            }}
            align={undefined}
          />
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingVertical: 20,
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  textInputView: {
    paddingHorizontal: 5,
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 5,
    height: 48,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  textInput: {flex: 1, color: ColorConstants.primaryBlack},
  iconStyle: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
