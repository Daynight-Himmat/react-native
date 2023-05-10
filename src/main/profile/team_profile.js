import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Tile} from '../../components/person_tile';
import AppHeader from '../../components/app_header';
import {Avatar} from '@rneui/themed';
import ProfileDemo from '../../components/profile_image_demo';

const TeamProfile = ({navigation, route}) => {
  const {data} = route.params;

  return (
    <View style={styles.container}>
      <AppHeader text={data?.name} navigate={() => navigation.goBack()} />
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() =>
          navigation.navigate('profile_image', {
            data: data,
          })
        }>
        {data.profile_image != null &&
        data.profile_image.split('.').pop() === 'jpg' ? (
          <Avatar
            size={120}
            rounded
            renderPlaceholderContent={<ActivityIndicator />}
            placeholderStyle={{backgroundColor: ColorConstants.primaryWhite}}
            source={{
              uri: data.profile_image,
            }}
          />
        ) : (
          <ProfileDemo
            containerSize={{
              height: 100,
              width: 100,
            }}
            iconSize={30}
          />
        )}
      </TouchableOpacity>

      <View style={styles.tile_column}>
        <Tile
          image={require('../../../assets/images/business.png')}
          title={data.name ?? 'No Name Found'}
        />
        <Tile
          image={require('../../../assets/images/emails.png')}
          title={data.email ?? 'No Email Found'}
        />
        <Tile
          image={require('../../../assets/images/phone.png')}
          title={data.mobile ?? 'No Number Found'}
        />
        <Tile
          image={require('../../../assets/images/designation.png')}
          title={data.designation ?? 'No Designation Found'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
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

  tile_column: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  tile_container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
  },
  tile_text_style: {
    color: ColorConstants.primaryBlack,
    fontSize: 14,
    fontWeight: '400',
  },
  tile_leading_icon: {
    height: 24,
    width: 24,
  },
});

export default TeamProfile;
