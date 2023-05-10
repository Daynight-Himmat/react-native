import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConstants from '../constants/color_constants';
import {Label} from './label';

const CompanyTile = ({index, name, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.inner_row}>
        <View style={styles.image_container}>
          <Ionicons
            name={'business-outline'}
            size={18}
            style={styles.icon_style}
          />
        </View>
        <View style={styles.title_container}>
          <Label name={name} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    width: '100%',
  },
  inner_row: {
    flexDirection: 'row',
    padding: 3,
  },
  image_container: {
    height: 35,
    width: 35,
    backgroundColor: ColorConstants.textLightBlack3,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon_style: {
    color: ColorConstants.primaryBlack,
    opacity: 1,
  },
  title_container: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

export default CompanyTile;
