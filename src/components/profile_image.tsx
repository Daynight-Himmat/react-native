import React, {FunctionComponent, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import {AppHeader} from './app_header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConstants from '../constants/color_constants';
import AppSize from './size';
import {BaseUrl, ApiConstants} from '../constants/api_constants';
import {Loading, NoData} from './no_data_found';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useToast} from 'react-native-toast-notifications';
import toastMessage from './toast_message';
const {height, width} = Dimensions.get('window');

type Props = {
  navigation: any;
  route: any;
};

const ProfileImage: FunctionComponent<Props> = ({route, navigation}) => {
  const {data, comeFrom, images, taskId} = route.params;
  const toast = useToast();
  const commentUrl = BaseUrl(ApiConstants.taskComments);
  const [comment, setComment] = useState('');
  const [isLoading, setLoading] = useState(false);

  const sendComment = async () => {
    try {
      setLoading(true);
      var token = await AsyncStorage.getItem('token');
      var userID = await AsyncStorage.getItem('user_id');
      const formData = new FormData();
      formData.append('token', token);
      formData.append('user_id', userID);
      formData.append('task_id', taskId);
      formData.append('comments', comment);
      images === ''
        ? formData.append('images', '')
        : formData.append('images', {
            uri: images,
            type: 'image/jpg',
            name: 'image',
          });
      await axios
        .post(commentUrl, formData)
        .then(response => {
          toastMessage(toast, response.data.message);
          console.log(response.data.message);
          setLoading(false);
          navigation.goBack();
        })
        .catch(_error => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        text={data?.name ?? ' '}
        navigate={() => navigation.goBack()}
        action={undefined}
      />
      <View style={styles.imageContainer}>
        {comeFrom === 'Task Details' ? (
          <Image
            style={styles.imageContainer}
            source={{uri: images}}
            resizeMode="cover"
          />
        ) : data.profile_image != null &&
          data.profile_image.split('.').pop() === 'jpg' ? (
          <Image
            style={styles.imageContainer}
            source={{
              uri: comeFrom === 'Task Details' ? images : data.profile_image,
            }}
            resizeMode="cover"
          />
        ) : (
          <NoData />
        )}
      </View>
      {comeFrom === 'Task Details' && (
        <View style={styles.bottom_container}>
          <View style={styles.text_input_container}>
            <TextInput
              style={styles.flex}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder="comment"
              placeholderTextColor={ColorConstants.textLightBlack1}
              multiline={true}
              numberOfLines={4}
              onChangeText={text => {
                setComment(text);
              }}
            />
            <AppSize width={10} height={undefined} />
            <TouchableOpacity
              onPress={() => {
                comment !== ''
                  ? sendComment()
                  : toastMessage(toast, 'Please enter your comment');
              }}>
              <Ionicons
                name={'send-sharp'}
                color={ColorConstants.textLightBlack1}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isLoading && <Loading />}
    </View>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    textAlignVertical: 'center',
  },
  container: {
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: ColorConstants.primaryWhite,
  },
  imageContainer: {
    height: height * 0.9,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    color: ColorConstants.primaryBlack,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  bottom_container: {
    width: '100%',
    height: 48,
    position: 'absolute',
    bottom: 30,
    // left: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  text_input_container: {
    height: 48,
    width: '100%',
    borderColor: ColorConstants.textLightBlack1,
    backgroundColor: ColorConstants.primaryWhite,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
