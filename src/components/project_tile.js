import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ColorConstants from '../constants/color_constants';
import Divider from './divider';

const ProjectTile = ({index, onPress, project_name, company_name}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View key={index} style={styles.container}>
        <View style={styles.intercontainer}>
          <View style={styles.subname_container}>
            <Text style={styles.subname}>{project_name.substring(0, 2)}</Text>
          </View>
          <View style={styles.namespace}>
            <Text style={styles.project_name_text}>{project_name}</Text>
            <Text style={styles.company_name_text}>{company_name}</Text>
          </View>
        </View>
        <Divider />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  intercontainer: {
    width: ' 100%',
    flexDirection: 'row',
    padding: 8,
  },
  subname_container: {
    height: 35,
    width: 35,
    flexDirection: 'column',
    backgroundColor: ColorConstants.primaryColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  subname: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorConstants.primaryWhite,
  },
  namespace: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  project_name_text: {
    width: '100%',
    fontSize: 14,
    fontWeight: '600',
    color: ColorConstants.primaryBlack,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  company_name_text: {
    width: '100%',
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.textLightBlack1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

export default ProjectTile;
