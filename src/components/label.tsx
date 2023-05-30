import React, {FunctionComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import FontConstants from '../constants/fonts';

type Props = {
  name: string;
  style: any;
  margin: number;
};

const Label: FunctionComponent<Props> = ({name, style, margin}) => {
  return (
    <View style={{marginVertical: margin ?? 0}}>
      <Text style={[styles.label_text, {...style}]}>{name}</Text>
    </View>
  );
};

type Props1 = {
  hightLightLabel: string;
};

const HighLightLabel: FunctionComponent<Props1> = ({hightLightLabel}) => {
  return (
    <View style={styles.introText}>
      <Text style={styles.label}>{hightLightLabel}</Text>
    </View>
  );
};

type Props2 = {
  lightText: string;
};

const LightText: FunctionComponent<Props2> = ({lightText}) => {
  return (
    <View style={styles.introTextView}>
      <Text style={styles.introText}>{lightText}</Text>
    </View>
  );
};

type Props3 = {
  lightText1: string;
};

const LightText1: FunctionComponent<Props3> = ({lightText1}) => {
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
    fontWeight: '600',
    justifyContent: 'center',
    alignSelf: 'center',
    fontFamily: FontConstants.light,
    color: ColorConstants.textLightBlack3,
    textAlign: 'center',
  },
  lightText1: {
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.textLightBlack1,
    fontFamily: FontConstants.semiBold,
  },
});

export {Label, LightText, LightText1, HighLightLabel};
