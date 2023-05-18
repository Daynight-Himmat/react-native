import React, {useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AuthImage from '../components/auth_image';
import AppSize from '../components/size';
import AppButton from '../components/app_button';
import {HighLightLabel, LightText} from '../components/label';
import axios from 'axios';
import {ApiConstants, BaseUrl, BaseUrl1} from '../constants/api_constants';
import toastMessage from '../components/toast_message';
import {Loading} from '../components/no_data_found';
import { useToast } from 'react-native-toast-notifications';

const ForgetPassword = ({navigation}) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const forgetPassUrl = BaseUrl(ApiConstants.signUp);

  const validateEmail = validEmail => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(validEmail);
  };

  const getForgetEmail = async () => {
    try {
      if (email === '') {
        toastMessage(toast, 'Please enter your email address');
      } else if (validateEmail(email) === false) {
        toastMessage(toast, 'Please enter valid email address');
      } else {
        setIsLoading(true);
        await axios
          .post(forgetPassUrl, {
            email: email,
            name: email,
            mobile: email,
            type: 'forgetPass',
          })
          .then(response => {
            if (response.status === 200) {
              if (response.data.success === true) {
                toastMessage(toast, response.data.message);
                navigation.navigate('otp_page', {
                  email: email,
                  name: email,
                  mobile: email,
                  otp: response.data?.data.otp,
                  comeFrom: 'forget_pass',
                });
              }
            }
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthImage image={require('../../assets/images/forgetPass.png')} />
      <HighLightLabel hightLightLabel={'Forget Password'} />
      <AppSize height={10} />
      <LightText
        lightText={
          'Don’t worry it happents. Please enter the' +
          '\n' +
          'email address associated with your account.'
        }
      />
      <AppSize height={20} />

      <View style={styles.textInputView}>
        <TextInput
          name="username"
          cursorColor={ColorConstants.primaryColor}
          style={styles.textInput}
          returnKeyType="next"
          enterKeyHint="next"
          placeholder="Enter your email address"
          placeholderTextColor={ColorConstants.textHintColor}
          onSubmitEditing={() => {}}
          onChangeText={value => setEmail(value)}
        />
      </View>
      <AppSize height={20} />
      <AppButton
        onPress={() => {
          getForgetEmail();
        }}
        text={'Verify'}
      />
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorConstants.primaryWhite,
    paddingHorizontal: 10,
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
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: ColorConstants.primaryBlack,
  },
});

export default ForgetPassword;
