import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import ColorConstants from '../../constants/color_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Tile} from '../../components/person_tile';

const TeamProfile = ({navigation, route}) => {
  const {index, data} = route.params;

  const [getData, setData] = useState([]);

  // setData(data);

  const check = () => {
    // setData(index);
    console.log(data);
  };

  useEffect(() => {
    check();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{padding: 10}} />
      <View style={styles.imageContainer}>
        {data.profile_image != null &&
        data.profile_image.split('.').pop() === 'jpg' ? (
          <Image
            style={styles.imageContainer}
            source={{uri: data.profile_image}}
          />
        ) : (
          <Ionicons name={'person-sharp'} size={35} style={styles.image} />
        )}
      </View>
      <View style={{padding: 10}} />
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
    paddingVertical: 10,
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
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
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
