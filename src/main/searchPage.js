import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import ColorConstants from '../constants/color_constants';
import SearchBox from '../components/search_box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {ApiConstants, BaseUrl} from '../constants/api_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading, NoData} from '../components/no_data_found';
import TaskTile from '../components/task_tile';

const SearchScreen = ({navigation}) => {
  const [getSearchText, setsearchData] = useState([]);
  const [searchText, setsearchText] = useState('');
  const [isLoading, setLoading] = useState(false);

  const searchUrl = BaseUrl(ApiConstants.taskSearch);

  const getSearchTask = async search => {
    try {
      if (search === '' || search.length < 2) {
        setsearchData([]);
        console.log('no search yet');
      } else {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        await axios
          .post(searchUrl, {
            token: token,
            search: `${search}`,
          })
          .then(response => {
            setLoading(false);
            console.log(response.data?.data);
            setsearchData(response.data?.data);
            // getSearchTask.slice(0, 20);
          });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons
            name={'arrow-back'}
            color={ColorConstants.primaryBlack}
            size={24}
          />
        </TouchableOpacity>
        <View
          style={{
            padding: 10,
            flex: 1,
          }}>
          <SearchBox
            value={searchText}
            searchPress={() => getSearchTask(searchText)}
            onChangeText={value => {
              setsearchText(value);
              getSearchTask(value);
            }}
          />
        </View>
      </View>
      {searchText === '' ? (
        <View
          style={{
            flex:1,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Image
            source={require('../assets/images/search.png')}
            style={{
              height: 300,
              width: 300,
            }}
          />
        </View>
      ) : getSearchText?.length > 0 ? (
        <ScrollView>
          {getSearchText.map((data, index) => {
            return (
              <TaskTile
                index={index}
                data={data}
                key={index}
                navigation={() => {
                  navigation.navigate('task_details_screen', {
                    data: data,
                  });
                }}
                screen={'search'}
              />
            );
          })}
        </ScrollView>
      ) : (
        <NoData />
      )}
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
  searchbar: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;
