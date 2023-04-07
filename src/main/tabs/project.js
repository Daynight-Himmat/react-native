import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import CompanyScreen from './company';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorConstants from '../../constants/color_constants';
import ProjectTile from '../../components/project_tile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BaseUrl, ApiConstants} from '../../constants/api_constants';
import SearchBox from '../../components/search_box';
import {Loading, NoData} from '../../components/no_data_found';

const ProjectScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [getprojectData, setProjectData] = useState([]);
  const [getSearchValue, setSearchValue] = useState(getprojectData);
  const [searchQuery, setSearchQuery] = useState('');

  const url = BaseUrl(ApiConstants.myProjectList);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checking = useCallback(async () => {
    try {
      setLoading(true);
      var userId = await AsyncStorage.getItem('user_id');
      var tokenValue = await AsyncStorage.getItem('token');
      console.log({userId: userId, token: tokenValue});
      await axios
        .post(url, {
          token: tokenValue,
          id: userId,
        })
        .then(response => {
          if (response.status === 200) {
            setProjectData(response.data.data?.data);
            setSearchValue(response.data.data?.data);
            setLoading(false);
            console.log(response.data.data?.data);
          }
        });
    } catch (error) {
      console.log(error);
    }
  });

  const handleSearch = text => {
    if (text === '') {
      setSearchValue(getprojectData);
    } else {
      const filtered = getprojectData.filter(item => {
        return (
          item.project_name?.toLowerCase().includes(text.toLowerCase()) ||
          item.company_name?.toLowerCase().includes(text.toLowerCase())
        );
      });
      setSearchValue(filtered);
      setSearchQuery(text);
    }
  };

  useEffect(() => {
    checking();
  }, []);

  return (
    <View style={styles.container}>
      <SearchBox
        onChangeText={handleSearch}
        onPress={() => {
          handleSearch(searchQuery);
        }}
      />
      <View style={{padding: 5}} />
      {loading === false ? (
        getSearchValue.length > 0 ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            {getSearchValue.map((data, index) => (
              <ProjectTile
                key={index}
                onPress={() => {
                  navigation.navigate('project_page_screen', {
                    data: data,
                  });
                }}
                company_name={data.company_name}
                project_name={data.project_name}
              />
            ))}
          </ScrollView>
        ) : (
          <NoData />
        )
      ) : (
        <Loading />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: ColorConstants.primaryWhite,
    paddingHorizontal: 10,
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

export default ProjectScreen;
