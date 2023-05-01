import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../components/app_header';
import {ViewProfileButton} from '../../components/text_button';

const EditProfile = ({navigation, route}) => {
  const {data} = route.params;
  const Label = ({name}) => {
    return (
      <View
        style={{
          width: '100%',
          paddingVertical: 5,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: ColorConstants.primaryBlack,
            justifyContent: 'flex-start',
            alignItems: 'center',
            fontWeight: '500',
          }}>
          {name}
        </Text>
      </View>
    );
  };

  const EditProfileForm = ({name, label}) => {
    return (
      <View>
        <Label name={label} />
        <View
          style={{
            height: 48,
            width: '100%',
            flexDirection: 'row',
            borderColor: ColorConstants.primaryBlack,
            borderRadius: 4,
            borderWidth: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: ColorConstants.primaryBlack,
              flex: 1,
            }}>
            {name}
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <Feather name={'edit-2'} color={ColorConstants.primaryBlack} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader text={'Edit Profile'} navigate={navigation} />
      <View style={styles.imageContainer}>
        {data.profile_image !== null &&
        data.profile_image.split('.').pop() === 'jpg' ? (
          <Image
            style={styles.imageContainer}
            source={{uri: data.profile_image}}
          />
        ) : (
          <Ionicons name={'person-sharp'} size={35} style={styles.image} />
        )}
      </View>
      <ViewProfileButton text={'Change Profile'} onPress={() => {}} />
      <EditProfileForm name={data.name ?? 'Enter the name'} label={'Name'} />
      <EditProfileForm
        name={data.mobile ?? 'Enter the mobile number'}
        label={'Number'}
      />
      <EditProfileForm
        name={data.designation ?? 'Enter the designation'}
        label={'Designation'}
      />
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
});

export default EditProfile;
