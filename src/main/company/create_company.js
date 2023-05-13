import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
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
import {Avatar} from '@rneui/themed';
import ImageCropPicker from 'react-native-image-crop-picker';

const CreateCompany = ({navigation, route}) => {
  const {companyData, comeFrom} = route.params;
  const [addMore, setAddMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyContactPerson, setContactPerson] = useState('');
  const [companyContactEmail, setContactEmail] = useState('');
  const [companyContactPhone, setContactPhone] = useState('');
  const [company1ContactPerson, set1ContactPerson] = useState('');
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
  const updateCompanyUrl = BaseUrl(ApiConstants.updateCompany);

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
        const formData = new FormData();
        formData.append('token', token);
        formData.append('company_name', companyName);
        formData.append('contact_name', name);
        formData.append('contact_email', email);
        formData.append('contact_number', number);
        companyLogo === ''
          ? formData.append('profile_picture', '')
          : formData.append('profile_picture', {
              uri: companyLogo,
              type: 'image/jpg',
              name: 'image',
            });
        var token = await AsyncStorage.getItem('token');
        setLoading(true);
        await axios.post(createCompanyUrl, formData).then(resposne => {
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

  const getUpdateCompanyDetails = async () => {
    try {
      if (validation()) {
        var token = await AsyncStorage.getItem('token');
        const contact =
          addMore === false
            ? comeFrom === 'Company Update'
              ? companyData[0].company_details[0] !== null
                ? [companyData[0].company_details[0].id]
                : []
              : companyData[0].company_details[1] !== null
              ? [
                  companyData[0].company_details[0].id,
                  companyData[0].company_details[1].id,
                ]
              : []
            : [];
        const formData = new FormData();
        formData.append('token', token);
        formData.append('id', companyData[0].id);
        formData.append('company_name', companyName);
        formData.append('contact_name', name);
        formData.append('contact_email', email);
        formData.append('contact_number', number);
        formData.append('contact_id', contact);
        companyLogo === ''
          ? formData.append('profile_picture', '')
          : formData.append('profile_picture', {
              uri: companyLogo,
              type: 'image/jpg',
              name: 'image',
            });

        // setLoading(true);
        const response = await axios({
          method: 'post',
          url: updateCompanyUrl,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data?.message);
        // await axios.post(updateCompanyUrl, formData).then(resposne => {
        //   if (resposne.status === 200) {
        //     setLoading(false);
        //     ToastMessage.showMessage(resposne.data?.message);
        //     navigation.goBack();
        //   }
        // });
      }
    } catch (err) {
      console.log({error: err});
      setLoading(false);
    }
  };

  useEffect(() => {
    const updateCompanyData = () => {
      if (comeFrom === 'Company Update') {
        setCompanyName(companyData[0].company_name);
        if (companyData[0].company_details !== null) {
          setContactPerson(
            companyData[0].company_details[0].contact_name ?? '',
          );
          setContactEmail(
            companyData[0].company_details[0].contact_email ?? '',
          );
          setContactPhone(
            companyData[0].company_details[0].contact_number ?? '',
          );
        } else if (companyData[0].company_details[1] !== null) {
          set1ContactPerson(
            companyData[0].company_details[1].contact_name ?? '',
          );
          set1ContactEmail(
            companyData[0].company_details[1].contact_email ?? '',
          );
          set1ContactPhone(
            companyData[0].company_details[1].contact_number ?? '',
          );
        }
      }
    };
    updateCompanyData();
  }, [comeFrom, companyData]);

  return (
    <View style={styles.container}>
      <AppHeader
        text={
          comeFrom === 'Company Create' ? 'Create Company' : 'Update Company'
        }
        navigate={() => navigation.goBack()}
      />
      <ScrollView>
        <AppSize height={20} />
        <View style={styles.imageView}>
          <TouchableOpacity style={styles.imageContain} onPress={() => {}}>
            <View style={styles.imageContainer}>
              {companyLogo !== '' ? (
                <Avatar
                  size={100}
                  rounded
                  renderPlaceholderContent={<ActivityIndicator />}
                  placeholderStyle={{
                    backgroundColor: ColorConstants.primaryWhite,
                  }}
                  source={{
                    uri: companyLogo,
                  }}
                />
              ) : (
                <Ionicons name={'business'} size={35} style={styles.image} />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <AppSize height={10} />
        <View
          style={{
            alignSelf: 'center',
          }}>
          <ViewProfileButton
            text={'Change Profile'}
            onPress={() => {
              ImageCropPicker.openPicker({
                compressImageMaxWidth: 300,
                compressImageMaxHeight: 300,
                cropping: false,
                multiple: false,
              }).then(image => {
                setCompanyLogo(image.path);
              });
            }}
          />
        </View>
        <AppSize height={20} />
        <Label name={'Company Name'} margin={10} />
        <TextInput
          value={companyName}
          placeholder="Enter the company name"
          placeholderTextColor={ColorConstants.textLightBlack1}
          style={styles.inputText}
          onChangeText={text => setCompanyName(text)}
        />
        <AppSize height={10} />

        <View style={styles.viewContainer}>
          <View>
            <Label name={'Contact Person 01'} margin={10} />
          </View>
          <TouchableOpacity
            onPress={() => {
              setAddMore(!addMore);
            }}
            style={styles.viewMore}>
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
          <Label name={'Name'} margin={10} />

          <TextInput
            value={companyContactPerson}
            placeholder="Enter contact person name"
            placeholderTextColor={ColorConstants.textLightBlack1}
            style={styles.inputText}
            onChangeText={text => setContactPerson(text)}
          />
          <Label name={'Mobile Number'} margin={10} />
          <TextInput
            value={companyContactPhone}
            placeholder="Enter mobile number"
            placeholderTextColor={ColorConstants.textLightBlack1}
            style={styles.inputText}
            maxLength={10}
            keyboardType="phone-pad"
            onChangeText={text => setContactPhone(text)}
          />
          <Label name={'Email'} margin={10} />
          <TextInput
            value={companyContactEmail}
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
          <View>
            <Label name={'Name'} margin={10} />

            <TextInput
              value={company1ContactPerson}
              placeholder="Enter contact person name"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
              onChangeText={text => set1ContactPerson(text)}
            />
            <Label name={'Mobile Number'} margin={10} />
            <TextInput
              value={company1ContactPhone}
              placeholder="Enter mobile number"
              placeholderTextColor={ColorConstants.textLightBlack1}
              style={styles.inputText}
              maxLength={10}
              keyboardType="phone-pad"
              onChangeText={text => set1ContactPhone(text)}
            />
            <Label name={'Email'} margin={10} />
            <TextInput
              value={company1ContactEmail}
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
          text={
            comeFrom === 'Company Update' ? 'Update Company' : 'Create Company'
          }
          style={{
            backgroundColor: ColorConstants.buttonGreenColor,
          }}
          onPress={() => {
            comeFrom === 'Company Update'
              ? getUpdateCompanyDetails()
              : getCompanyDetails();
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
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMore: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
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
  imageView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
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
    paddingVertical:15,
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: ColorConstants.primaryBlack,
  },
});

export default CreateCompany;
