import React, {useState} from 'react';
import {View, ScrollView, TextInput, Image, StyleSheet} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Loading} from '../../components/no_data_found';
import {Label} from '../../components/label';
import {Ionicons} from '../../components/icons';
import AppSize from '../../components/size';
import {ViewProfileButton} from '../../components/text_button';
import AppButton from '../../components/app_button';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import {AppHeader} from '../../components/app_header';

const CreateProfile = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const createMember = BaseUrl(ApiConstants.signUp);
  const verifyOtp = BaseUrl(ApiConstants.verifyOtp);
  const register = BaseUrl(ApiConstants.registration);

  const createNewMember = () => {
    try {
      console.log({
        name: name,
        mobile: mobile,
        email: email,
        designation: designation,
      });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        text={'Create Team Member'}
        navigate={() => navigation.goBack()}
      />
      <ScrollView>
        <AppSize height={20} />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={styles.imageContainer}>
            {/* {data.profile_image !== null &&
        data.profile_image.split('.').pop() === 'jpg' ? (
          <Image
            style={styles.imageContainer}
            source={{uri: data.profile_image}}
          />
        ) : ( */}
            <Ionicons name={'person-sharp'} size={35} style={styles.image} />
            {/* )} */}
          </View>
        </View>
        <AppSize height={10} />

        <View style={{alignSelf: 'center'}}>
          <ViewProfileButton text={'Add Image'} />
        </View>
        <AppSize height={20} />

        <View style={{width: '100%'}}>
          <Label name={'Name'} margin={10} />

          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/images/business.png')}
              style={styles.tile_leading_icon}
              resizeMode="contain"
            />
            <AppSize width={5} margin={10} />
            <TextInput
              placeholder="Enter the name"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
              onChangeText={text => setName(text)}
            />
          </View>
          <Label name={'Mobile Number'} margin={10} />
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/images/phone.png')}
              style={styles.tile_leading_icon}
              resizeMode="contain"
            />
            <AppSize width={5} margin={10} />
            <TextInput
              placeholder="Enter the number"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
            />
          </View>
          <Label name={'Email'} margin={10} />
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/images/emails.png')}
              style={styles.tile_leading_icon}
              resizeMode="contain"
            />
            <AppSize width={5} />
            <TextInput
              placeholder="Enter the email-address"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
            />
          </View>
          <Label name={'Designation'} margin={10} />
          <View style={styles.inputContainer}>
            <Image
              source={require('../../../assets/images/designation.png')}
              style={styles.tile_leading_icon}
              resizeMode="contain"
            />
            <AppSize width={5} />
            <TextInput
              placeholder="Enter the Designation"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
            />
          </View>
        </View>
        <AppSize height={10} />

        <AppSize height={20} />
        <AppButton
          text={'Add Member'}
          onPress={() => {
            createNewMember();
          }}
        />
        <AppSize height={20} />
      </ScrollView>
      {isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.primaryWhite,
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorConstants.textHintColor,
  },
  image: {
    color: ColorConstants.primaryWhite,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  contactName: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: ColorConstants.primaryWhite,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 12,
    padding: 10,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
    borderColor: ColorConstants.primaryBlack,
    borderWidth: 1,
    borderRadius: 5,
  },
  inputText: {
    height: 40,
    backgroundColor: ColorConstants.primaryWhite,
    borderRadius: 10,
    shadowColor: '#000',
    paddingHorizontal: 10,
    color: ColorConstants.primaryBlack,
  },
  tile_leading_icon: {
    height: 24,
    width: 24,
  },
});

export default CreateProfile;
