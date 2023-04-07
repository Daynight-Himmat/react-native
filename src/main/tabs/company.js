/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading, NoData} from '../../components/no_data_found';
import ColorConstants from '../../constants/color_constants';
import CompanyTile from '../../components/company_tile';
import {BaseUrl1, ApiConstants} from '../../constants/api_constants';
import SearchBox from '../../components/search_box';

const CompanyScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [getCompany, setCompanyData] = useState([]);
  const [getSearchQuery, setSearchQuery] = useState(getCompany);

  const url = BaseUrl1(ApiConstants.companyList);

  const focused = useIsFocused();

  const getCompanyData = useCallback(async () => {
    try {
      setLoading(true);
      var asyncToken = await AsyncStorage.getItem('token');
      var userId = await AsyncStorage.getItem('user_id');
      await axios
        .post(url, {
          token: asyncToken,
          id: userId,
        })
        .then(response => {
          if (response.status === 200) {
            setCompanyData(response.data.data?.data);
            setSearchQuery(response.data.data?.data);
            setLoading(false);
            console.log(response.data.data?.data);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  });

  useEffect(() => {
    getCompanyData();
  }, []);

  const handleSearch = text => {
    if (text === '') {
      setSearchQuery(getCompany);
    } else {
      const filtered = getCompany.filter(item => {
        return item.company_name.toLowerCase().includes(text.toLowerCase());
      });
      setSearchQuery(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBox onChangeText={handleSearch} />
      <View style={{padding: 5}} />
      {getSearchQuery.length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          {getSearchQuery.map((data, index) => (
            <CompanyTile
              key={index}
              name={data.company_name}
              onPress={() => {
                navigation.navigate('company_info', {
                  company_id: data.id,
                });
              }}
            />
          ))}
        </ScrollView>
      ) : (
        <NoData />
      )}
      {isLoading && <Loading />}
    </View>
  );
};

export default CompanyScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  list: {
    width: '100%',
    padding: 8,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  loading: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 40,
    width: 40,
    backgroundColor: ColorConstants.textLightBlack3,
    borderRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  loadingText: {
    color: ColorConstants.primaryBlack,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
