import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import ColorConstants from '../constants/color_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppSize from './size';
import {Label, LightText1} from './label';

const PersonTile = ({index, image, title, subTitle, tilePress, imagePress}) => {
  return (
    <TouchableOpacity onPress={tilePress}>
      <View key={index} style={styles.container}>
        <View style={styles.lite}>
          <TouchableOpacity onPress={imagePress}>
            <View style={styles.imageContainer}>
              {image != null && image.split('.').pop() === 'jpg' ? (
                <Image style={styles.imageContainer} source={{uri: image}} />
              ) : (
                // <Image source={{uri: image}} resizeMode="center" />
                <Ionicons
                  name={'person-sharp'}
                  size={14}
                  style={styles.image}
                />
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>
              {subTitle != null ? subTitle : 'No Designation'}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    </TouchableOpacity>
  );
};

const Tile = ({image, title}) => {
  return (
    <View style={styles.tile_container}>
      <Image
        source={image}
        style={styles.tile_leading_icon}
        resizeMode="contain"
      />
      <Text style={styles.tile_text_style}>{title}</Text>
    </View>
  );
};

const TimeTile = ({color, label, time, type}) => {
  return (
    <View style={timeTilestyle(color, type).row}>
      <View style={timeTilestyle(color, type).calenderStyle}>
        {type === 'date' ? (
          <Ionicons name={'calendar'} size={24} color={color} />
        ) : (
          <Ionicons
            name={'person-sharp'}
            // size={24}
            color={ColorConstants.primaryWhite}
          />
        )}
      </View>
      <AppSize width={10} />
      {type === 'date' ? (
        <View style={timeTilestyle(color, type).column}>
          <Label name={label} />
          <LightText1 lightText1={time} color={color} />
        </View>
      ) : (
        <View style={timeTilestyle(color, type).column}>
          <Label name={label} />
          <View
            style={{
              width: '80%',
              paddingRight: 20,
            }}>
            <Text
              style={{
                color: ColorConstants.textHintColor,
                fontSize: 12,
              }}>
              {time}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const TimeContainer = ({dateLabel, date, style, color}) => {
  return (
    <View style={styles.time_Container}>
      {dateLabel === 'Deadline' ? (
        <View
          style={[
            styles.date_container,
            {
              borderWidth: 0,
              borderColor: ColorConstants.textLightBlack1,
              paddingVertical: 0,
            },
          ]}>
          <Text style={styles.date_label}>{dateLabel}</Text>
          <AppSize width={5} />
          <Ionicons name={'pencil'} color={ColorConstants.primaryBlack} />
        </View>
      ) : (
        <Text style={styles.date_label}>{dateLabel}</Text>
      )}
      <AppSize height={3} />
      <View style={[styles.date_container, style]}>
        <Ionicons name={'calendar'} color={color} />
        <AppSize width={5} />
        <Text style={[styles.date_text, style]}>{date}</Text>
      </View>
    </View>
  );
};

export {PersonTile, Tile, TimeTile, TimeContainer};

const timeTilestyle = (color, type) =>
  StyleSheet.create({
    column: {
      width: '100%',
      paddingRight: 0,
      flexDirection: 'column',
      alignItems: 'flex-start',
      alignContent: 'center',
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 10,
      justifyContent: 'flex-start',
    },
    calenderStyle: {
      height: 40,
      width: 40,
      borderWidth: 1,
      borderColor: type === 'date' ? color : ColorConstants.textLightBlack1,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        type === 'date' ? ColorConstants.white : ColorConstants.textLightBlack1,
    },
  });

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
    flexDirection: 'column',
    elevation: 10,
  },
  time_Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date_label: {
    fontWeight: '500',
    color: ColorConstants.primaryBlack,
  },
  date_container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: ColorConstants.primaryColor,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 7,
  },
  date_text: {
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.primaryBlack,
  },
  lite: {
    height: 60,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 30,
    width: 30,
    borderRadius: 100,
    backgroundColor: ColorConstants.textHintColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  image: {
    color: ColorConstants.primaryWhite,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorConstants.primaryBlack,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.teamHiColor,
  },
  divider: {
    height: 0.6,
    width: '100%',
    backgroundColor: ColorConstants.textLightBlack3,
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
