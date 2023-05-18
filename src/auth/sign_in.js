import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {TexTButton} from '../components/text_button';
import ColorConstants from '../constants/color_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataManager from '../constants/static_data';
import AppButton from '../components/app_button';
import toastMessage from '../components/toast_message';
import { MaterialIcons } from '../components/icons';
import AuthImage from '../components/auth_image';
import AppSize from '../components/size';
import {HighLightLabel} from '../components/label';
import {ApiConstants, BaseUrl, BaseUrl1} from '../constants/api_constants';
import {Loading} from '../components/no_data_found';
import { useToast } from 'react-native-toast-notifications';
import axiosInstance from '../components/interceptor';


const SignInScreen = ({navigation}) => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [isLoading, setLoading] = useState('');
  const [password, setpassword] = useState('');
  const [visibility, setVisibility] = useState(true);

  const emailFocus = useRef();
  const passwordFocus = useRef();

  const logInUrl = BaseUrl(ApiConstants.logIn);

  const validateEmail = validEmail => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(validEmail);
  };

  var email = name;
  var userPassword = password;

  const getUserLogIn = async () => {
    try {
      if (email === '' && password === '') {
        toastMessage(toast, 'Please fill the required');
      } else if (email === '') {
        toastMessage(toast, 'Please Enter the email');
      } else if (validateEmail(email) === false) {
        toastMessage(toast, 'Please Enter Valid the email');
      } else if (password === '') {
        toastMessage(toast, 'Please Enter the Password');
      } else {
        setLoading(true);
        const response = await axios.post(logInUrl, {
          email: email,
          password: userPassword,
          firebase_token: email,
        });
        if (response.status === 200) {
          if (response.data.success === true) {
            DataManager.token = response.data.token;
            AsyncStorage.setItem('token', response.data.token);
            AsyncStorage.setItem('loggedIn', 'true');
            setLoading(false);
            navigation.navigate('dashboard', {
              token: response.data.token,
            });
            toastMessage(toast, "User Log In Successfully");
          } else {
            setLoading(false);
            toastMessage(toast, 'Something went wrong, please try again');
          }
        } else {
          setLoading(false);
          console.log(response.data);
        }
        console.log(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      toastMessage(toast, `${error.data}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <AppSize height={20} />
          <AuthImage image={require('../../assets/images/sign_in.png')} />
          <HighLightLabel hightLightLabel={'Sign In'} />
          <AppSize height={20} />
          <View style={styles.textInputView}>
            <TextInput
              name="username"
              cursorColor={ColorConstants.primaryColor}
              style={styles.textInput}
              returnKeyType="next"
              enterKeyHint="next"
              ref={emailFocus}
              placeholder="Enter your email address"
              placeholderTextColor={ColorConstants.textHintColor}
              onSubmitEditing={() => passwordFocus.current.focus()}
              onChangeText={value => setName(value)}
            />
          </View>
          <AppSize height={20} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              secureTextEntry={visibility}
              enterKeyHint="next"
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
          <AppSize height={2} />
          <TexTButton
            onPressText={'Forget Password ?'}
            align={'flex-end'}
            callBack={() => {
              navigation.navigate('forget_pass');
            }}
          />
          <AppSize height={2} />
          <AppButton
            onPress={() => {
              getUserLogIn();
            }}
            text={'LogIn'}
          />
          <AppSize height={20} />
          <TexTButton
            infoText={"Don't have an account"}
            onPressText={'SignUp'}
            callBack={() => {
              navigation.navigate('sign_up');
            }}
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
    alignContent: 'center',
    alignItems: 'center',
  },
});
