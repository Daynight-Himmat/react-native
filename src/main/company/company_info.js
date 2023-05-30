import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import {Loading, NoData} from '../../components/no_data_found';
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
  BaseUrl1,
  CompanyProfileImage,
} from '../../constants/api_constants';
import {Appbar} from 'react-native-paper';
import ProfileDemo from '../../components/profile_image_demo';
import {Avatar} from '@rneui/themed';
import FontConstants from '../../constants/fonts';
import toastMessage from '../../components/toast_message';
import {CommanHeader} from '../../components/app_header';
import ProjectTile from '../../components/project_tile';
import Condition from '../../components/conditions';
import {useToast} from 'react-native-toast-notifications';

const CompanyInfo = ({navigation, route}) => {
  const {company_id} = route.params;
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [getCompanyData, setCompanyData] = useState([]);
  const [getProjectListData, setProjectListData] = useState([]);

  const getCompanyUrl = BaseUrl(ApiConstants.companyDetails);
  const getCompanyProjectUrl = BaseUrl(ApiConstants.companyProjectList);
  const deleteCompanyUrl = BaseUrl(ApiConstants.destroyCompany);

  const getCompanyDetails = async () => {
    try {
      setLoading(true);
      var token = await AsyncStorage.getItem('token');
      const response = await axios.post(getCompanyUrl, {
        token: token,
        id: company_id,
      });
      if (response.status === 200) {
        setLoading(false);
        console.log(response.data);
        setCompanyData(response.data?.data);
        getProjectDetails();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getProjectDetails = async () => {
    try {
      // setLoading(true);
      var token = await AsyncStorage.getItem('token');
      const response = await axios.post(getCompanyProjectUrl, {
        token: token,
        id: company_id,
      });
      if (response.status === 200) {
        setLoading(false);
        setProjectListData(response.data?.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteCompany = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(deleteCompanyUrl, {
        token: token,
        id: company_id,
        deleted: 'Yes',
      });
      if (response.status === 200) {
        setLoading(false);
        toastMessage(toast, response.data?.message);
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      console.log('this is the error===', error);
    }
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Delete Company', 'Are you sure you want to Delete Company ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete', onPress: () => deleteCompany()},
    ]);

  useEffect(() => {
    getCompanyDetails();
  }, []);

  console.log();

  return (
    <View style={styles.container}>
      <CommanHeader
        deletePress={() => createTwoButtonAlert()}
        navigation={navigation}
        pencilPress={() => {
          navigation.navigate('create_company', {
            companyData: getCompanyData,
            comeFrom: 'Company Update',
          });
        }}
        title={'Company Profile'}
      />
      {getCompanyData.map((data, index) => (
        <View key={index}>
          {Condition.imageUrl(data?.profile_picture) ? (
            <Avatar
              size={100}
              rounded
              containerStyle={{
                alignSelf: 'center',
              }}
              renderPlaceholderContent={<ActivityIndicator />}
              placeholderStyle={{
                backgroundColor: ColorConstants.primaryWhite,
              }}
              source={{
                uri: CompanyProfileImage(data?.profile_picture),
              }}
            />
          ) : (
            <View style={styles.imageContain}>
              <View style={styles.imageContainer}>
                <Ionicons name={'business'} size={35} style={styles.image} />
              </View>
            </View>
          )}

          <View style={{paddingHorizontal: 15}}>
            <Label name={data?.company_name} />
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
                  data?.company_details[0]?.contact_name ?? 'No Name Found'
                }
              />
              <Tile
                image={require('../../../assets/images/emails.png')}
                title={
                  data?.company_details[0]?.contact_email ?? 'No Email Found'
                }
              />
              <Tile
                image={require('../../../assets/images/phone.png')}
                title={
                  data?.company_details[0]?.contact_number ?? 'No Number Found '
                }
              />
            </View>
          </View>
        </View>
      ))}
      <View style={styles.projectList}>
        <View style={styles.contactName}>
          <Label name={'Company Project'} />
          {getProjectListData.length > 0 ? (
            <ScrollView>
              {getProjectListData?.map((data, index) => (
                <ProjectTile
                  project_name={data.project_name}
                  key={index}
                  index={index}
                />
              ))}
            </ScrollView>
          ) : (
            <NoData />
          )}
        </View>
      </View>
      <AppSize height={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorConstants.primaryWhite,
  },
  headerWidth: {
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 17,
    fontFamily: FontConstants.ragular,
  },
  imageContain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 100,
    justifyContent: 'center',
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
    backgroundColor: ColorConstants.primaryWhite,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 12,
    padding: 10,
  },
  projectList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
export default CompanyInfo;
