import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TextInput, ScrollView} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AuthImage from '../components/auth_image';
import {HighLightLabel} from '../components/label';
import AppSize from '../components/size';
import AppButton from '../components/app_button';
import {TexTButton} from '../components/text_button';
import axios from 'axios';
import {ApiConstants, BaseUrl1} from '../constants/api_constants';
import {Loading} from '../components/no_data_found';
import toastMessage from '../components/toast_message';
import { useToast } from 'react-native-toast-notifications';

const SignUpScreen = ({navigation}) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailFocus = useRef();
  const nameFocus = useRef();
  const mobileFocus = useRef();

  const register = BaseUrl1(ApiConstants.signUp);

  const validateEmail = validEmail => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(validEmail);
  };

  const getRegister = async () => {
    try {
      if (email === '' && name === '' && mobile === '') {
        toastMessage(toast, 'Please Enter the required');
      } else if (email === '') {
        toastMessage(toast, 'Please Enter the email');
      } else if (name === '') {
        toastMessage(toast, 'Please Enter the name');
      } else if (mobile === '') {
        toastMessage(toast, 'Please Enter the number');
      } else if (mobile.length !== 10) {
        toastMessage(toast, 'Please Enter the valid number');
      } else if (name.length < 3) {
        toastMessage(toast, 'Please Enter the valid name');
      } else if (validateEmail(email) === false) {
        toastMessage(toast, 'Please Enter the valid email');
      } else {
        setIsLoading(true);
        await axios
          .post(register, {
            email: email,
            name: name,
            mobile: mobile,
          })
          .then(response => {
            if (response.status === 200) {
              if (response.data.success === true) {
                toastMessage(toast, response.data?.message);
                navigation.navigate('otp_page', {
                  email: email,
                  name: name,
                  mobile: mobile,
                  otp: response.data?.data.otp,
                  comeFrom: 'register',
                });
              }
              setIsLoading(false);
            }
          })
          .catch(error => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Sign Up',
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <AuthImage image={require('../../assets/images/sign_up.png')} />
          <HighLightLabel hightLightLabel={'Create an account'} />
          <AppSize height={10} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              returnKeyType="next"
              enterKeyHint="next"
              ref={nameFocus}
              placeholder="Enter your name"
              onSubmitEditing={() => emailFocus.current.focus()}
              placeholderTextColor={ColorConstants.textHintColor}
              onChangeText={value => setName(value)}
            />
          </View>
          <AppSize height={15} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              returnKeyType="next"
              enterKeyHint="next"
              ref={emailFocus}
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor={ColorConstants.textHintColor}
              onSubmitEditing={() => mobileFocus.current.focus()}
              onChangeText={value => setEmail(value)}
            />
          </View>
          <AppSize height={15} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              keyboardType="numeric"
              maxLength={10}
              ref={mobileFocus}
              returnKeyType="next"
              enterKeyHint="next"
              placeholder="Enter your number"
              placeholderTextColor={ColorConstants.textHintColor}
              onChangeText={value => setMobile(value)}
              onSubmitEditing={() => mobileFocus.current.focus()}
            />
          </View>
          <AppSize height={30} />
          <AppButton
            text={'Register'}
            onPress={() => {
              getRegister();
            }}
          />
          <AppSize height={20} />
          <TexTButton
            infoText={'Already have an account'}
            onPressText={'SignIn'}
            callBack={() => {
              navigation.navigate('sign_in');
            }}
          />
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingVertical: 20,
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'column',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  textInputView: {
    paddingHorizontal: 10,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default SignUpScreen;
