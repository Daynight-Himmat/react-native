import React, {FunctionComponent, useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AuthImage from '../components/auth_image';
import AppSize from '../components/size';
import AppButton from '../components/app_button';
import {HighLightLabel, LightText} from '../components/label';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import toastMessage from '../components/toast_message';
import {Loading} from '../components/no_data_found';
import {useToast} from 'react-native-toast-notifications';
import CommanFunctions from '../components/comman_functions';

type Props = {
  navigation: any;
};

const ForgetPassword: FunctionComponent<Props> = ({navigation}) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const forgetPassUrl = BaseUrl(ApiConstants.signUp);

  const getForgetEmail = async () => {
    try {
      if (email === '') {
        toastMessage(toast, 'Please enter your email address');
      } else if (CommanFunctions.validateEmail(email) === false) {
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
          .catch(_error => {
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
      <AppSize height={10} width={undefined} />
      <LightText
        lightText={
          'Don’t worry it happents. Please enter the' +
          '\n' +
          'email address associated with your account.'
        }
      />
      <AppSize height={20} width={undefined} />

      <View style={styles.textInputView}>
        <TextInput
          value={email}
          cursorColor={ColorConstants.primaryColor}
          style={styles.textInput}
          returnKeyType="next"
          placeholder="Enter your email address"
          placeholderTextColor={ColorConstants.textHintColor}
          onSubmitEditing={() => {}}
          onChangeText={value => setEmail(value)}
        />
      </View>
      <AppSize height={20} width={undefined} />
      <AppButton
        onPress={() => {
          getForgetEmail();
        }}
        text={'Verify'}
        style={undefined}
        textStyle={undefined}
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
  iconStyle: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default ForgetPassword;
