import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import ColorConstants from '../constants/color_constants';
import FontConstants from '../constants/fonts';

const {height, width} = Dimensions.get('screen');
const Label = ({name, style}) => {
  return (
    <View>
      <Text style={[styles.label_text, {...style}]}>{name}</Text>
    </View>
  );
};

const HighLightLabel = ({hightLightLabel}) => {
  return (
    <View style={styles.introText}>
      <Text style={styles.label}>{hightLightLabel}</Text>
    </View>
  );
};

const LightText = ({lightText}) => {
  return (
    <View style={styles.introTextView}>
      <Text style={styles.introText}>{lightText}</Text>
    </View>
  );
};

const LightText1 = ({lightText1, color}) => {
  return (
    <View>
      <Text style={styles.lightText1}>{lightText1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    width: '100%',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: ColorConstants.primaryBlack,
  },
  label_text: {
    fontSize: 14,
    color: ColorConstants.primaryBlack,
    fontFamily: FontConstants.medium,
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontWeight: '500',
  },
  introTextView: {
    width: '90%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  introText: {
    fontSize: 14,
    fontWeight: '400',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    color: ColorConstants.textLightBlack3,
    textAlign: 'center',
  },
  lightText1: {
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.textLightBlack1,
    fontFamily: FontConstants.light,
  },
});

export {Label, LightText, LightText1, HighLightLabel};
