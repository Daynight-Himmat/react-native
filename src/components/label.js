import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';

const Label = ({name}) => {
  return (
    <View style={styles().label_container}>
      <Text style={styles().label_text}>{name}</Text>
    </View>
  );
};

const HighLightLabel = ({hightLightLabel}) => {
  return (
    <View style={styles().introText}>
      <Text style={styles().label}>{hightLightLabel}</Text>
    </View>
  );
};

const LightText = ({lightText}) => {
  return (
    <View style={styles().introTextView}>
      <Text style={styles().introText}>{lightText}</Text>
    </View>
  );
};

const LightText1 = ({lightText1, color}) => {
  return (
    <View>
      <Text style={styles(color).lightText1}>{lightText1}</Text>
    </View>
  );
};

const styles = color =>
  StyleSheet.create({
    label_container: {
      width: '100%',
      paddingVertical: 5,
    },
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
      fontSize: 14,
      fontWeight: '400',
      color: color ?? ColorConstants.textLightBlack1,
    },
  });

export {Label, LightText, LightText1, HighLightLabel};
