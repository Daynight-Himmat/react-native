import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConstants from '../constants/color_constants';

const CompanyTile = ({index, name, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View key={index} style={styles.container}>
        <View style={styles.inner_row}>
          <View style={styles.image_container}>
            <Ionicons
              name={'business-outline'}
              size={18}
              style={styles.icon_style}
            />
          </View>
          <View style={styles.title_container}>
            <Text style={styles.title}>{name}</Text>
          </View>
        </View>
        <View style={styles.space} />
        <View style={styles.divider} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 2,
    width: '100%',
  },
  inner_row: {
    flexDirection: 'row',
    width: '100%',
    padding: 3,
  },
  image_container: {
    height: 35,
    width: 35,
    backgroundColor: ColorConstants.textLightBlack3,
    borderRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  icon_style: {
    color: ColorConstants.primaryBlack,
    opacity: 1,
  },
  title_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    color: ColorConstants.primaryBlack,
  },
  space: {padding: 2},
  divider: {
    height: 1,
    backgroundColor: ColorConstants.textLightBlack3,
  },
});

export default CompanyTile;
