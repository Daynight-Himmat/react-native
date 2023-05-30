import React, {FunctionComponent, useState} from 'react';
import {
  View,
  StyleSheet,
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
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import toastMessage from '../components/toast_message';
import {useToast} from 'react-native-toast-notifications';
import CommanFunctions from '../components/comman_functions';

type Props = {
  navigation: any;
  route: any;
};

const CreatePassword: FunctionComponent<Props> = ({navigation, route}) => {
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [confirmvisibility, setConFirmVisibility] = useState(false);
  const [password, setpassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const {email, name, mobile, comeFrom} = route.params;

  const createPass = BaseUrl(ApiConstants.registration);
  const updatePass = BaseUrl(ApiConstants.updateUserPassword);

  const getRegister = async () => {
    try {
      if (password === '') {
        toastMessage(toast, 'Please enter the password');
      } else if (confirmpassword === '') {
        toastMessage(toast, 'Please enter the Confirm password');
      } else if (password !== confirmpassword) {
        toastMessage(toast, 'Password Not Match');
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
                if (response.status === 200) {
                  console.log(response.data);
                  if (response.data.error === 0) {
                    setLoading(false);
                    toastMessage(toast, response.data?.message);
                    CommanFunctions.routing(navigation, 'sign_in');
                  } else {
                    setLoading(false);
                  }
                } else {
                  setLoading(false);
                  toastMessage(toast, response.data?.error?.email);
                }
              })
              .catch(_error => {
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
                    toastMessage(toast, response.data?.message);
                    navigation.navigate('sign_in');
                  }
                }
              })
              .catch(_error => {
                setLoading(false);
              });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <AuthImage image={require('../../assets/images/createPass.png')} />
          <HighLightLabel hightLightLabel={'Create Password'} />
          <AppSize height={10} width={undefined} />
          <LightText
            lightText={
              'Your password must be different from ' +
              '\n' +
              ' previously used password'
            }
          />
          <AppSize height={30} width={undefined} />
          <Label name={'Password'} style={undefined} margin={0} />
          <AppSize height={2} width={undefined} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              secureTextEntry={visibility}
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
          <AppSize height={10} width={undefined} />
          <Label name={'Confirm Password'} style={undefined} margin={0} />
          <AppSize height={2} width={undefined} />
          <View style={styles.textInputView}>
            <TextInput
              style={styles.textInput}
              cursorColor={ColorConstants.primaryColor}
              secureTextEntry={confirmvisibility}
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
          <AppSize height={20} width={undefined} />
          <AppButton
            text={'Create Password'}
            onPress={() => {
              getRegister();
            }}
            style={undefined}
            textStyle={undefined}
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
  iconStyle: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePassword;
