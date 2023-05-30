import React, {FunctionComponent} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ColorConstants from '../constants/color_constants';
import Dividers from './divider';
import {Label, LightText1} from './label';
import FontConstants from '../constants/fonts';

type Props = {
  onPress: any;
  project_name: string;
  company_name: string;
};

const ProjectTile: FunctionComponent<Props> = ({
  onPress,
  project_name,
  company_name,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.intercontainer}>
          <View style={styles.subname_container}>
            <Text style={styles.subname}>{project_name.substring(0, 2)}</Text>
          </View>
          <View style={styles.namespace}>
            <Label name={project_name} style={undefined} margin={undefined} />
            {company_name && (
              <LightText1 lightText1={company_name} color={undefined} />
            )}
          </View>
        </View>
        <Dividers h1={undefined} w1={undefined} mv={5} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  intercontainer: {
    width: ' 100%',
    flexDirection: 'row',
    padding: 5,
  },
  subname_container: {
    height: 35,
    width: 35,
    backgroundColor: ColorConstants.primaryColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subname: {
    fontSize: 14,
    color: ColorConstants.primaryWhite,
    fontFamily: FontConstants.semiBold,
  },
  namespace: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

export default ProjectTile;
