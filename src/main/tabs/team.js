import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {PersonTile} from '../../components/person_tile';
import {NoData, Loading} from '../../components/no_data_found';
import {BaseUrl, ApiConstants} from '../../constants/api_constants';
import SearchBox from '../../components/search_box';

const TeamScreen = ({navigation}) => {
  const [token, setToken] = useState('');
  const [userData, setData] = useState([]);
  const [searchUser, setSearchData] = useState(userData);
  const [isLoading, setLoading] = useState(false);

  const url = BaseUrl(ApiConstants.getUserList);

  const getTeamData = async () => {
    try {
      setLoading(true);
      var asyncStorageRes = await AsyncStorage.getItem('token');
      await axios
        .post(url, {
          token: asyncStorageRes,
        })
        .then(response => {
          if (response.status === 200) {
            setData(response.data?.data);
            setSearchData(response.data?.data);
            setLoading(false);
          }
        })
        .catch(error => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = text => {
    if (text === '') {
      setSearchData(userData);
    } else {
      const filtered = userData.filter(item => {
        return (
          item.name?.toLowerCase().includes(text.toLowerCase()) ||
          item.designation?.toLowerCase().includes(text.toLowerCase())
        );
      });
      setSearchData(filtered);
    }
  };

  useEffect(() => {
    getTeamData();
  }, []);

  return (
    <View style={styles.container}>
      <SearchBox onChangeText={handleSearch} />
      {searchUser.length > 0 ? (
        <ScrollView>
          {searchUser.map((data, index) => (
              <PersonTile
                key={index}
                image={data.profile_image}
                title={data.name}
                subTitle={data.designation}
                imagePress={() => {
                  navigation.navigate('team_profile', {
                    index: index,
                    data: data,
                  });
                }}
                tilePress={() => {
                  navigation.navigate('team_task_screen', {
                    data: data,
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

export default TeamScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.primaryWhite,
  },

  lite: {
    height: 70,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  image: {
    color: ColorConstants.primaryBlack,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColorConstants.primaryBlack,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.textLightBlack1,
  },
});
