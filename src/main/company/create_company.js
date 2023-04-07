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
import {ApiConstants, BaseUrl1} from '../../constants/api_constants';
import axios from 'axios';

const CreateCompany = ({navigation}) => {
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

  const createCompanyUrl = BaseUrl1(ApiConstants.companyEdit);

  const getCompanyDetails = async () => {
    try {
      var token = await AsyncStorage.getItem('token');
      var userId = await AsyncStorage.getItem('user_id');
      console.log({token: token, userId: userId});
      console.log({
        addmore: addMore,
        companyName: companyName,
        companyContactPerson: companyContactPerson,
        companyContactEmail: companyContactEmail,
        companyContactPhone: companyContactPhone,
      });
      await axios
        .post(createCompanyUrl, {
          token: token,
          company_name: companyName,
          contact_name: [companyContactPerson, company1ContactPerson],
          contact_number: [companyContactPhone, company1ContactPhone],
          contact_email: [companyContactEmail, companyContactEmail],
          profile_picture: '',
        })
        .then(resposne => {
          if (resposne.status === 200) {
            console.log(resposne.data);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          alignContent: 'center',
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

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            flexDirection: 'row',
          }}>
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
