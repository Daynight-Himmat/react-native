import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorConstants from '../../constants/color_constants';
import ProjectTile from '../../components/project_tile';
import {BaseUrl, BaseUrl1, ApiConstants} from '../../constants/api_constants';
import SearchBox from '../../components/search_box';
import {Loading, NoData} from '../../components/no_data_found';

const ProjectScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [getprojectData, setProjectData] = useState([]);
  const [getSearchValue, setSearchValue] = useState(getprojectData);
  const [searchQuery, setSearchQuery] = useState('');

  const url = BaseUrl1(ApiConstants.myProjectList);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checking = useCallback(async () => {
    try {
      setLoading(true);
      var userId = await AsyncStorage.getItem('user_id');
      var tokenValue = await AsyncStorage.getItem('token');
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
          <ScrollView>
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
