import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../components/app_header';
import {ViewProfileButton} from '../../components/text_button';
import {Label} from '../../components/label';
import FontConstants from '../../constants/fonts';
import AppButton from '../../components/app_button';
import AppSize from '../../components/size';
import ToastMessage from '../../components/toast_message';
import RowButton from '../../components/row_button';
import axios from 'axios';
import {
  ApiConstants,
  BaseUrl,
  ProfileImage,
} from '../../constants/api_constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Loading} from '../../components/no_data_found';
import {Avatar} from '@rneui/themed';

const EditProfile = ({navigation, route}) => {
  // const {data} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();
  const [value, setValue] = useState('');
  const [place, setPlace] = useState('');
  const [label, setLabel] = useState('');
  const [name, setName] = useState(data?.name);
  const [number, setNumber] = useState(data?.mobile);
  const [designation, setDescription] = useState(data?.designation);
  const [loading, setLoading] = useState(false);
  const profileEditUrl = BaseUrl(ApiConstants.updateUserData);
  const url = BaseUrl(ApiConstants.getUser);

  const [isImagePick, updateImagePick] = useState(false);
  const [imageUri, updateImage] = useState();

  const show = message => {
    switch (message) {
      case 'Name':
        return 'Name Update';
      case 'Number':
        return 'Number Update';
      case 'Designation':
        return 'Designation Update';
    }
  };

  const set = message => {
    switch (message) {
      case 'Name':
        return setName(value);
      case 'Number':
        return setNumber(value);
      case 'Designation':
        return setDescription(value);
    }
  };

  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('id', data?.id);
      formData.append('token', token);
      formData.append('name', label === 'Name' ? value : data?.name);
      formData.append('mobile', label === 'Number' ? value : data?.mobile);
      formData.append('email', data?.email);
      formData.append(
        'designation',
        label === 'Designation' ? value : data?.designation,
      );
      imageUri === ''
        ? formData.append('profile_image', '')
        : formData.append('profile_image', {
            uri: imageUri,
            type: 'image/jpg',
            name: 'image',
          });

      const response = await axios({
        method: 'post',
        url: profileEditUrl,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        isImagePick === true
          ? ToastMessage.showMessage(response.data?.message)
          : ToastMessage.showMessage(show(label));
        updateUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async () => {
    try {
      setLoading(true);
      const asyncStorageRes = await AsyncStorage.getItem('token');
      await axios
        .post(url, {
          token: asyncStorageRes,
        })
        .then(response => {
          if (response.status === 200) {
            setData(response.data?.user);
            updateImage(response.data?.user?.profile_image);
            setName(response.data?.user?.name);
            setNumber(response.data?.user?.mobile);
            setDescription(response.data?.user?.designation);
            AsyncStorage.setItem('user_id', `${response.data?.user.id}`);
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const editData = [
    {
      label: 'Name',
      place: name ?? 'Enter the Name',
    },
    {
      label: 'Number',
      place: number ?? 'Enter the Mobile Number',
    },
    {
      label: 'Designation',
      place: designation ?? 'Enter the Designation',
    },
  ];

  const EditProfileForm = ({name, label, onPress}) => {
    return (
      <View>
        <Label name={label} />
        <View style={styles.nameContainer}>
          <Text style={styles.inputName}>{name}</Text>
          <TouchableOpacity style={styles.iconsClick} onPress={onPress}>
            <Feather name={'edit-2'} color={ColorConstants.primaryBlack} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    updateUser();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: modalVisible
            ? 'rgba(0,0,0,0.5)'
            : ColorConstants.primaryWhite,
        },
      ]}>
      <AppHeader
        text={'Edit Profile'}
        navigate={() => navigation.goBack({data: data})}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.innerModel}>
              <Label name={label} />
              <AppSize height={10} />
              <TextInput
                value={value}
                placeholder={place}
                keyboardType={label === 'Number' ? 'phone-pad' : 'default'}
                placeholderTextColor={ColorConstants.textLightBlack1}
                style={styles.inputText}
                onChangeText={text => setValue(text)}
              />
              <AppSize height={10} />
              <RowButton
                text={'Save'}
                onback={() => setModalVisible(!modalVisible)}
                onPress={() => {
                  if (label === 'Number') {
                    if (value.length !== 10) {
                      ToastMessage.showMessage('Enter the valid Number');
                    } else {
                      updateProfile();
                      setModalVisible(!modalVisible);
                      set(label);
                    }
                  } else {
                    updateProfile();
                    setModalVisible(!modalVisible);
                    set(label);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.imageContainer}>
        <Avatar
          size={100}
          rounded
          renderPlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{backgroundColor: ColorConstants.primaryWhite}}
          source={
            imageUri
              ? {
                  uri: imageUri,
                }
              : require('../../assets/images/profiles.png')
          }
        />
      </View>
      <ViewProfileButton
        text={'Change Profile'}
        onPress={() => {
          ImageCropPicker.openPicker({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: false,
            multiple: false,
          }).then(image => {
            updateImagePick(true);
            updateImage(image.path);
            updateProfile();
          });
        }}
      />
      {editData.map((edit, index) => (
        <EditProfileForm
          key={index}
          name={edit.place}
          label={edit.label}
          onPress={() => {
            setModalVisible(!modalVisible);
            updateImagePick(false);
            setPlace(edit.place);
            setLabel(edit.label);
            setValue(edit.place);
          }}
        />
      ))}
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: ColorConstants.primaryWhite,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 100,
  },
  innerModel: {
    width: '100%',
    padding: 10,
  },
  inputText: {
    borderColor: ColorConstants.textLightBlack1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: ColorConstants.primaryBlack,
  },
  inputName: {
    color: ColorConstants.primaryBlack,
    fontFamily: FontConstants.ragular,
    flex: 1,
  },
  iconsClick: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  nameContainer: {
    height: 48,
    width: '100%',
    flexDirection: 'row',
    borderColor: ColorConstants.primaryBlack,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default EditProfile;
