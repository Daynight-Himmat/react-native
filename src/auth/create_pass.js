import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AuthImage from '../components/auth_image';
import {HighLightLabel, Label, LightText} from '../components/label';
import AppSize from '../components/size';
import AppButton from '../components/app_button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Loading} from '../components/no_data_found';
import axios from 'axios';
import {ApiConstants, BaseUrl, BaseUrl1} from '../constants/api_constants';
import ToastMessage from '../components/toast_message';

const CreatePassword = ({navigation, route}) => {
  const [isLoading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [confirmvisibility, setConFirmVisibility] = useState(false);
  const [password, setpassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const {email, name, mobile, comeFrom} = route.params;

  const createPass = BaseUrl1(ApiConstants.registration);
  const updatePass = BaseUrl1(ApiConstants.updateUserPassword);

  const getRegister = async () => {
    try {
      if (password === '') {
        ToastMessage.showMessage('Please enter the password');
      } else if (confirmpassword === '') {
        ToastMessage.showMessage('Please enter the password');
      } else if (password !== confirmpassword) {
        ToastMessage.showMessage('Please enter the password');
      } else {
        setLoading(true);
        comeFrom === 'register'
          ? await axios
              .post(createPass, {
                name: name,
                email: email,
                mobile: mobile,
                password: password,
              })
              .then(response => {
                console.log(response.data);
                if (response.status === 200) {
                  if (response.data.error === 0) {
                    console.log(response.data);
                    setLoading(false);
                    ToastMessage.showMessage(response.data?.message);
                    navigation.navigate('sign_in');
                    console.log('part error === 0 ', response.data);
                  } else {
                    setLoading(false);
                  }
                } else {
                  setLoading(false);
                  ToastMessage.showMessage(response.data?.error?.email);
                  console.log(response.data);
                  console.log('else part status !== 200 ', response.data);
                }
              })
              .catch(error => {
                console.log(error);
                setLoading(false);
              })
          : await axios
              .post(updatePass, {
                email: email,
                password: password,
                password_confirmation: password,
              })
              .then(response => {
                if (response.status === 200) {
                  if (response.data.error === 0) {
                    setLoading(false);
                    console.log(response.data);
                    ToastMessage.showMessage(response.data?.message);
                    navigation.navigate('sign_in');
                  }
                }
              })
              .catch(error => {
                console.log(error);
                setLoading(false);
              });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <AuthImage image={require('../../assets/images/createPass.png')} />
          <HighLightLabel hightLightLabel={'Create Password'} />
          <AppSize height={10} />
          <LightText
            lightText={
              'Your password must be different from ' +
              '\n' +
              ' previously used password'
            }
          />
          <AppSize height={30} />
          <Label name={'Password'} />
          <AppSize height={2} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              secureTextEntry={visibility}
              enterKeyHint="next"
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
          <AppSize height={10} />
          <Label name={'Confirm Password'} />
          <AppSize height={2} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              secureTextEntry={confirmvisibility}
              enterKeyHint="next"
              placeholder="Enter your Confirm password"
              placeholderTextColor={ColorConstants.textHintColor}
              onChangeText={value => setConfirmPassword(value)}
            />
            <TouchableOpacity
              onPress={() => {
                setConFirmVisibility(!confirmvisibility);
              }}>
              <MaterialIcons
                name={confirmvisibility ? 'visibility' : 'visibility-off'}
                size={20}
                color={ColorConstants.textHintColor}
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>
          <AppSize height={20} />
          <AppButton
            text={'Create Password'}
            onPress={() => {
              getRegister();
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
    alignContent: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ColorConstants.primaryBlack,
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
});

export default CreatePassword;
