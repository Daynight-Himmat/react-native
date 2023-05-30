import React, {useState, FunctionComponent} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import AuthImage from '../components/auth_image';
import AppSize from '../components/size';
import OTPInput from 'react-native-otp-forminput';
import AppButton from '../components/app_button';
import {HighLightLabel, LightText} from '../components/label';
import axios from 'axios';
import toastMessage from '../components/toast_message';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import {Loading} from '../components/no_data_found';
import {useToast} from 'react-native-toast-notifications';

type Props = {
  navigation: any;
  route: any;
};

const OtpPage: FunctionComponent<Props> = ({navigation, route}) => {
  const toast = useToast();
  const {email, name, mobile, otp, comeFrom} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [getOtp, setOtp] = useState('');
  const verifyOtp = BaseUrl(ApiConstants.verifyOtp);

  const getVerifyOtp = async () => {
    try {
      if (getOtp === '') {
        toastMessage(toast, `Otp Invalid ${getOtp} ${otp}`);
        toastMessage(toast, 'Otp Invalid');
      } else {
        setLoading(true);
        await axios
          .post(verifyOtp, {
            mobile: email,
            otp: otp,
          })
          .then(response => {
            if (response.status === 200) {
              setLoading(false);
              toastMessage(toast, response.data?.message);
              navigation.navigate('create_pass', {
                email: email,
                name: name,
                mobile: mobile,
                comeFrom: comeFrom,
              });
            }
          })
          .catch((_error: any) => {
            setLoading(false);
          });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <AuthImage image={require('../../assets/images/otp.png')} />
          <HighLightLabel hightLightLabel={'Enter OTP'} />
          <AppSize height={10} width={undefined} />
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
              onChange={(code: React.SetStateAction<string>) => {
                setOtp(code);
              }}
            />
          </View>
          <AppSize height={20} width={undefined} />
          <AppButton
            text={'Verify'}
            onPress={() => {
              getVerifyOtp();
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
