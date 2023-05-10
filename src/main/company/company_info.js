import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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
import ProfileDemo from '../../components/profile_image_demo';
import {Avatar} from '@rneui/themed';
import FontConstants from '../../constants/fonts';

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
      const response = await axios.post(getCompanyUrl, {
        token: token,
        id: company_id,
      });
      if (response.status === 200) {
        setLoading(false);
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

  useEffect(() => {
    getCompanyDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerWidth}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Company Profile"
          color={ColorConstants.primaryBlack}
          titleStyle={styles.headerText}
        />
        <Appbar.Action
          icon="pencil"
          onPress={() => {
            navigation.navigate('create_company', {
              companyData: getCompanyData,
              comeFrom: 'Company Update',
            });
          }}
        />
        <Appbar.Action
          icon="delete"
          color={ColorConstants.highLightColor}
          onPress={() => {}}
        />
      </Appbar.Header>
      <ScrollView>
        {getCompanyData.map((data, index) => (
          <View key={index}>
            <View style={styles.imageContain}>
              <View style={styles.imageContainer}>
                {data?.profile_picture != null &&
                data?.profile_picture.split('.').pop() === 'jpg' ? (
                  <Avatar
                    size={35}
                    rounded
                    renderPlaceholderContent={<ActivityIndicator />}
                    placeholderStyle={{
                      backgroundColor: ColorConstants.primaryWhite,
                    }}
                    source={{
                      uri: CompanyProfileImage + data?.profile_picture,
                    }}
                  />
                ) : (
                  <Ionicons name={'business'} size={35} style={styles.image} />
                )}
              </View>
            </View>
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
                    data?.company_details[0]?.contact_number ??
                    'No Number Found '
                  }
                />
              </View>
            </View>
          </View>
        ))}
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
          <View style={styles.contactName}>
            <Label name={'Company Project'} />

            <ScrollView>
              {getProjectListData?.map((data, index) => (
                <CompanyTile
                  key={index}
                  index={index}
                  name={data.project_name}
                />
              ))}
            </ScrollView>
          </View>
        </View>
        <AppSize height={20} />
      </ScrollView>
    </View>

    // <View style={styles.container}>
    //   <Appbar.Header
    //     style={{
    //       width: '100%',
    //       backgroundColor: ColorConstants.primaryWhite,
    //     }}>
    //     <Appbar.BackAction onPress={() => navigation.goBack()} />
    //     <Appbar.Content
    //       title="Company Profile"
    //       color={ColorConstants.primaryBlack}
    //       titleStyle={{
    //         fontWeight: '700',
    //         fontSize: 20,
    //       }}
    //     />
    //     <Appbar.Action
    //       icon="pencil"
    //       onPress={() => {
    //         navigation.navigate('create_company');
    //       }}
    //     />
    //     <Appbar.Action
    //       icon="delete"
    //       color={ColorConstants.highLightColor}
    //       onPress={() => {}}
    //     />
    //   </Appbar.Header>
    //   <ScrollView>
    //     <AppSize height={20} />
    //     <View
    //       style={styles.imageContain}>
    //       <View style={styles.imageContainer}>
    //         {getCompanyData[0]?.profile_picture != null &&
    //         getCompanyData[0]?.profile_picture.split('.').pop() === 'jpg' ? (
    //           <Avatar
    //             size={35}
    //             rounded
    //             renderPlaceholderContent={<ActivityIndicator />}
    //             placeholderStyle={{
    //               backgroundColor: ColorConstants.primaryWhite,
    //             }}
    //             source={{
    //               uri: CompanyProfileImage + getCompanyData[0]?.profile_picture,
    //             }}
    //           />
    //         ) : (
    //           <Ionicons name={'business'} size={35} style={styles.image} />
    //         )}
    //       </View>
    //     </View>
    //     <AppSize height={20} />

    //     <View />
    //     <View
    //       style={{
    //         width: '100%',
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         alignItems: 'center',
    //         paddingHorizontal: 10,
    //         backgroundColor: ColorConstants.primaryWhite,
    //       }}>
    //       <Label name={getCompanyData[0]?.company_name} />
    //     </View>
    //     <View
    //       style={{
    //         paddingHorizontal: 10,
    //         paddingVertical: 5,
    //       }}>
    //       <View style={styles.contactName}>
    //         <Label name={'Contact Name'} />
    //         <Tile
    //           image={require('../../../assets/images/business.png')}
    //           title={
    //             getCompanyData[0]?.company_details[0]?.contact_name ??
    //             'No Name Found'
    //           }
    //         />
    //         <Tile
    //           image={require('../../../assets/images/emails.png')}
    //           title={
    //             getCompanyData[0]?.company_details[0]?.contact_email ??
    //             'No Email Found'
    //           }
    //         />
    //         <Tile
    //           image={require('../../../assets/images/phone.png')}
    //           title={
    //             getCompanyData[0]?.company_details[0]?.contact_number ??
    //             'No Number Found '
    //           }
    //         />
    //       </View>
    //     </View>
    //     {/* <View
    //       style={{
    //         paddingHorizontal: 10,
    //         paddingVertical: 5,
    //       }}>
    //       <View style={styles.contactName}>
    //         <Label name={'Company Project'} />

    //         {getProjectListData?.map((data, index) => (
    //           <CompanyTile key={index} index={index} name={data.project_name} />
    //         ))}
    //       </View>
    //     </View> */}
    //   </ScrollView>
    //   {isLoading && <Loading />}
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
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
    justifyContent: 'flex-start',
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
