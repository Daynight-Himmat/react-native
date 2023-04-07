import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AuthImage from '../components/auth_image';
import AppSize from '../components/size';
import OTPInput from 'react-native-otp-forminput';
import AppButton from '../components/app_button';
import {HighLightLabel, LightText} from '../components/label';
import axios from 'axios';
import ToastMessage from '../components/toast_message';
import {ApiConstants, BaseUrl1} from '../constants/api_constants';
import {Loading} from '../components/no_data_found';

const OtpPage = ({navigation, route}) => {
  const {email, name, mobile, otp, comeFrom} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [getOtp, setOtp] = useState(false);
  const verifyOtp = BaseUrl1(ApiConstants.verifyOtp);

  const getVerifyOtp = async () => {
    console.log(otp, email, mobile, name);
    try {
      if (getOtp === '') {
        ToastMessage.showMessage(`Otp Invalid ${getOtp} ${otp}`);
        ToastMessage.showMessage('Otp Invalid');
      } else {
        setLoading(true);
        await axios
          .post(verifyOtp, {
            mobile: email,
            otp: otp,
          })
          .then(response => {
            if (response.status === 200) {
              console.log(response.data);
              setLoading(false);
              console.log(email, name, mobile, comeFrom);
              navigation.navigate('create_pass', {
                email: email,
                name: name,
                mobile: mobile,
                comeFrom: comeFrom,
              });
            }
          })
          .catch(error => {
            console.log(error);
            setLoading(false);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <AuthImage image={require('../../assets/images/otp.png')} />
          <HighLightLabel hightLightLabel={'Enter OTP'} />
          <AppSize height={10} />
          <LightText
            lightText={
              'Please enter a 4 digit code which has been sent to you email address'
            }
          />
          <View style={styles.otpStyles}>
            <OTPInput
              title="Enter OTP"
              type="filled"
              backgroundColor={ColorConstants.textLightBlack1}
              color={ColorConstants.primaryBlack}
              style={{
                color: ColorConstants.primaryBlack,
              }}
              inputStyle={styles.inputStyle}
              onChange={code => {
                setOtp(code);
                console.log(code);
              }}
            />
          </View>
          <AppSize height={20} />
          <AppButton
            text={'Verify'}
            onPress={() => {
              getVerifyOtp();
              // navigation.navigate('create_pass');
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
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: ColorConstants.primaryBlack,
  },
  otpStyles: {
    width: '100%',
    height: 100,
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignContent: 'center',
  },
  introTextView: {
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  introText: {
    fontSize: 14,
    fontWeight: '400',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    color: ColorConstants.textLightBlack3,
    textAlign: 'center',
  },
  inputStyle: {
    color: ColorConstants.primaryBlack,
    backgroundColor: ColorConstants.otpColor,
    borderColor: ColorConstants.otpColor,
    fontWeight: 'bold',
  },
});

export default OtpPage;
