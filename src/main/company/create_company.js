import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Loading} from '../../components/no_data_found';
import {Label} from '../../components/label';
import {Ionicons} from '../../components/icons';
import AppSize from '../../components/size';
import {ViewProfileButton} from '../../components/text_button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppButton from '../../components/app_button';
import {ApiConstants, BaseUrl} from '../../constants/api_constants';
import axios from 'axios';
import ToastMessage from '../../components/toast_message';
import AppHeader from '../../components/app_header';

const CreateCompany = ({navigation}) => {
  const [addMore, setAddMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyContactPerson, setContactPerson] = useState('');
  const [companyContactEmail, setContactEmail] = useState('');
  const [companyContactPhone, setContactPhone] = useState('');
  const [company1ContactPerson, set1ContactPerson] = useState('No Name');
  const [company1ContactEmail, set1ContactEmail] = useState('');
  const [company1ContactPhone, set1ContactPhone] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const name =
    addMore === false
      ? [companyContactPerson]
      : [companyContactPerson, company1ContactPerson];
  const number =
    addMore === false
      ? [companyContactPhone]
      : [companyContactPhone, company1ContactPhone];
  const email =
    addMore === false
      ? [companyContactEmail]
      : [companyContactEmail, company1ContactEmail];

  const createCompanyUrl = BaseUrl(ApiConstants.companyEdit);

  const validateEmail = validEmail => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(validEmail);
  };

  const validation = () => {
    if (!addMore) {
      if (!companyName) {
        ToastMessage.showMessage('Company Name is required');
        return false;
      } else if (!companyContactPerson) {
        ToastMessage.showMessage('Name is required');
        return false;
      } else if (!companyContactPhone) {
        ToastMessage.showMessage('Number is required');
        return false;
      } else if (companyContactPhone.length !== 10) {
        ToastMessage.showMessage('Number is Invalid');
        return false;
      } else if (!companyContactEmail) {
        ToastMessage.showMessage('Email is required');
        return false;
      } else if (validateEmail(companyContactEmail) === false) {
        ToastMessage.showMessage('Email is Invalid');
        return false;
      } else {
        return true;
      }
    } else {
      if (!companyName) {
        ToastMessage.showMessage('Company Name is required');
        return false;
      } else if (!companyContactPerson) {
        ToastMessage.showMessage('Name is required');
        return false;
      } else if (!companyContactPhone) {
        ToastMessage.showMessage('Number is required');
        return false;
      } else if (companyContactPhone.length !== 10) {
        ToastMessage.showMessage('Number is Invalid');
        return false;
      } else if (!companyContactEmail) {
        ToastMessage.showMessage('Email is required');
        return false;
      } else if (validateEmail(companyContactEmail) === false) {
        ToastMessage.showMessage('Email is Invalid');
        return false;
      } else if (!company1ContactPerson) {
        ToastMessage.showMessage('Contact person 2 Name is required');
        return false;
      } else if (!company1ContactPhone) {
        ToastMessage.showMessage('Contact person 2 Number is required');
        return false;
      } else if (company1ContactPhone.length !== 10) {
        ToastMessage.showMessage('Contact person 2 Number is Invalid');
        return false;
      } else if (!company1ContactEmail) {
        ToastMessage.showMessage('Contact person 2 Email is required');
        return false;
      } else if (validateEmail(company1ContactEmail) === false) {
        ToastMessage.showMessage('Contact person 2 Email is Invalid');
        return false;
      } else {
        return true;
      }
    }
  };

  const getCompanyDetails = async () => {
    try {
      if (validation()) {
        var token = await AsyncStorage.getItem('token');
        setLoading(true);
        await axios
          .post(createCompanyUrl, {
            token: token,
            company_name: companyName,
            contact_name: name,
            contact_number: number,
            contact_email: email,
            profile_picture: '',
          })
          .then(resposne => {
            if (resposne.status === 200) {
              setLoading(false);
              ToastMessage.showMessage(resposne.data?.message);
              navigation.goBack();
            }
          });
      }
    } catch (err) {
      console.log({error: err});
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <AppHeader text={'Create Company'} navigate={()=> navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <AppSize height={20} />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <View style={styles.imageContainer}>
            {/* {data.profile_image !== null &&
        data.profile_image.split('.').pop() === 'jpg' ? (
          <Image
            style={styles.imageContainer}
            source={{uri: data.profile_image}}
          />
        ) : ( */}
            <Ionicons name={'business'} size={35} style={styles.image} />
            {/* )} */}
          </View>
        </View>
        <AppSize height={10} />

        <View style={styles.addLogo}>
          <ViewProfileButton text={'Add Logo'} />
        </View>
        <AppSize height={20} />
        <Label name={'Company Name'} />
        <TextInput
          placeholder="Enter the company name"
          placeholderTextColor={ColorConstants.textLightBlack1}
          style={styles.inputText}
          onChangeText={text => setCompanyName(text)}
        />
        <AppSize height={10} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <Label name={'Contact Person 01'} />
          </View>
          <TouchableOpacity
            onPress={() => {
              setAddMore(!addMore);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flex: 1,
            }}>
            <Text
              style={{
                color: !addMore
                  ? ColorConstants.primaryBlack
                  : ColorConstants.highLightColor,
              }}>
              {!addMore ? 'Add More +' : 'Remove'}
            </Text>
          </TouchableOpacity>
        </View>

        <AppSize height={10} />
        <View
          style={{
            width: '100%',
          }}>
          <Label name={'Name'} />

          <TextInput
            placeholder="Enter contact person name"
            placeholderTextColor={ColorConstants.textLightBlack1}
            style={styles.inputText}
            onChangeText={text => setContactPerson(text)}
          />
          <Label name={'Mobile Number'} />
          <TextInput
            placeholder="Enter mobile number"
            placeholderTextColor={ColorConstants.textLightBlack1}
            style={styles.inputText}
            maxLength={10}
            keyboardType="phone-pad"
            onChangeText={text => setContactPhone(text)}
          />
          <Label name={'Email'} />
          <TextInput
            placeholder="Enter email Address"
            placeholderTextColor={ColorConstants.textLightBlack1}
            style={styles.inputText}
            onChangeText={text => setContactEmail(text)}
          />
        </View>
        <AppSize height={10} />
        {addMore ? <Label name={'Contact Person 02'} /> : <View />}
        <AppSize height={10} />
        {addMore ? (
          <View
            style={{
              width: '100%',
            }}>
            <Label name={'Name'} />

            <TextInput
              placeholder="Enter contact person name"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
              onChangeText={text => set1ContactPerson(text)}
            />
            <Label name={'Mobile Number'} />
            <TextInput
              placeholder="Enter mobile number"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
              maxLength={10}
              keyboardType="phone-pad"
              onChangeText={text => set1ContactPhone(text)}
            />
            <Label name={'Email'} />
            <TextInput
              placeholder="Enter email Address"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
              onChangeText={text => set1ContactEmail(text)}
            />
          </View>
        ) : (
          <View />
        )}
        <AppSize height={20} />
        <AppButton
          text={'Create Company'}
          style={{
            backgroundColor: ColorConstants.buttonGreenColor,
          }}
          onPress={() => {
            getCompanyDetails();
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
  addLogo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
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
  inputText: {
    width: '100%',
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: ColorConstants.primaryBlack,
  },
});

export default CreateCompany;
