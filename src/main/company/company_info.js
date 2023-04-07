import React, {useState, useEffect} from 'react';
import {View, ScrollView, Text, Image, StyleSheet} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Loading} from '../../components/no_data_found';
import {Label} from '../../components/label';
import {Ionicons} from '../../components/icons';
import AppSize from '../../components/size';
import {Tile} from '../../components/person_tile';
import CompanyTile from '../../components/company_tile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  ApiConstants,
  BaseUrl,
  CompanyProfileImage,
} from '../../constants/api_constants';
import {Appbar} from 'react-native-paper';

const CompanyInfo = ({navigation, route}) => {
  const {company_id} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [getCompanyData, setCompanyData] = useState([]);
  const [getProjectListData, setProjectListData] = useState([]);

  const getCompanyUrl = BaseUrl(ApiConstants.companyDetails);
  const getCompanyProjectUrl = BaseUrl(ApiConstants.companyProjectList);

  const getCompanyDetails = async () => {
    try {
      setLoading(true);
      var token = await AsyncStorage.getItem('token');
      var userId = await AsyncStorage.getItem('user_id');
      console.log({token: token, userId: userId, company_id: company_id});
      const response = await axios.post(getCompanyUrl, {
        token: token,
        id: company_id,
      });
      if (response.status === 200) {
        setLoading(false);
        console.log({data: response.data.data});
        setCompanyData(response.data?.data);
        getProjectDetails();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getProjectDetails = async () => {
    try {
      setLoading(true);
      var token = await AsyncStorage.getItem('token');
      var userId = await AsyncStorage.getItem('user_id');
      console.log({token: token, userId: userId, company_id: company_id});
      const response = await axios.post(getCompanyProjectUrl, {
        token: token,
        id: company_id,
      });
      if (response.status === 200) {
        setLoading(false);
        console.log({data: response.data.data});
        setProjectListData(response.data?.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(company_id);
    getCompanyDetails();
  });

  return (
    <View style={styles.container}>
      <Appbar.Header
        style={{
          width: '100%',
          backgroundColor: ColorConstants.primaryWhite,
        }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Company Profile"
          color={ColorConstants.primaryBlack}
          titleStyle={{
            fontWeight: '700',
            fontSize: 20,
          }}
        />
        <Appbar.Action
          icon="pencil"
          onPress={() => {
            navigation.navigate('create_company');
          }}
        />
        <Appbar.Action
          icon="delete"
          color={ColorConstants.highLightColor}
          onPress={() => {}}
        />
      </Appbar.Header>
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
            paddingHorizontal: 10,
            backgroundColor: ColorConstants.primaryWhite,
          }}>
          <View style={styles.imageContainer}>
            {getCompanyData[0]?.profile_picture === '' ? (
              <Ionicons name={'business'} size={35} style={styles.image} />
            ) : (
              <Image
                style={styles.imageContainer}
                source={{
                  uri: CompanyProfileImage + getCompanyData[0]?.profile_picture,
                }}
              />
            )}
          </View>
        </View>
        <AppSize height={20} />
        <View />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            backgroundColor: ColorConstants.primaryWhite,
          }}>
          <Label name={getCompanyData[0]?.company_name} />
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
          <View style={styles.contactName}>
            <Label name={'Contact Name'} />
            <Tile
              image={require('../../../assets/images/business.png')}
              title={
                getCompanyData[0]?.company_details[0]?.contact_name ??
                'No Name Found'
              }
            />
            <Tile
              image={require('../../../assets/images/emails.png')}
              title={
                getCompanyData[0]?.company_details[0]?.contact_email ??
                'No Email Found'
              }
            />
            <Tile
              image={require('../../../assets/images/phone.png')}
              title={
                getCompanyData[0]?.company_details[0]?.contact_number ??
                'No Number Found '
              }
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
          <View style={styles.contactName}>
            <Label name={'Company Project'} />

            {getProjectListData?.map((data, index) => (
              <CompanyTile key={index} index={index} name={data.project_name} />
            ))}
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
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
});
export default CompanyInfo;
