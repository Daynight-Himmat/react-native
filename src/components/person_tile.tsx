import React, {FunctionComponent} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import ColorConstants from '../constants/color_constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppSize from './size';
import {Label, LightText1} from './label';
import {Divider} from 'react-native-paper';
import FontConstants from '../constants/fonts';
import {Avatar} from '@rneui/themed';
import ProfileDemo from './profile_image_demo';
import Condition from './conditions';
import Dividers from './divider';

type Props = {
  index?: any;
  image?: any;
  title?: string;
  subTitle?: string;
  tilePress?: any;
  imagePress?: any;
};

const PersonTile: FunctionComponent<Props> = ({
  index,
  image,
  title,
  subTitle,
  tilePress,
  imagePress,
}) => {
  return (
    <TouchableOpacity onPress={tilePress}>
      <View key={index} style={styles.container}>
        <View style={styles.lite}>
          <TouchableOpacity onPress={imagePress}>
            {Condition.imageUrl(image) ? (
              <View>
                <Avatar
                  size={35}
                  rounded
                  renderPlaceholderContent={<ActivityIndicator />}
                  placeholderStyle={{
                    backgroundColor: ColorConstants.primaryWhite,
                  }}
                  source={{
                    uri: image,
                  }}
                />
              </View>
            ) : (
              <ProfileDemo
                containerSize={{
                  height: 35,
                  width: 35,
                }}
                iconSize={undefined}
              />
            )}
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Label name={title!} style={undefined} margin={0} />
            {subTitle !== null && <LightText1 lightText1={subTitle!} />}
          </View>
        </View>
        <Dividers h1={1} w1={undefined} mv={15} />
      </View>
    </TouchableOpacity>
  );
};

type Props1 = {
  image: any;
  title: string;
  widget: any;
  tailer: any;
  divider: any;
  textStyle: any;
  color: any;
  onPress: any;
};

const Tile: FunctionComponent<Props1> = ({
  image,
  title,
  widget: leading,
  tailer,
  divider,
  textStyle,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View style={styles.tile_container}>
        {leading}
        {image && (
          <Image
            source={image}
            style={styles.tile_leading_icon}
            resizeMode="contain"
          />
        )}
        <AppSize width={10} height={undefined} />
        <View style={textStyle}>
          <Label name={title} style={textStyle} margin={0} />
        </View>
        {tailer === true && (
          <Ionicons
            name={'ios-chevron-forward-outline'}
            color={color ?? ColorConstants.primaryBlack}
          />
        )}
      </View>
      {divider && <Divider style={{height: divider}} />}
    </TouchableOpacity>
  );
};

type Props2 = {
  label: string;
  color: any;
  time: any;
};

const TimeTile: FunctionComponent<Props2> = ({color, label, time}) => {
  return (
    <View style={timeTilestyle.row}>
      <View style={[timeTilestyle.calenderStyle, {borderColor: color}]}>
        <Ionicons name={'calendar'} size={18} color={color} />
      </View>
      <AppSize width={10} height={undefined} />
      <View>
        <Label name={label} style={undefined} margin={0} />
        <LightText1 lightText1={time} />
      </View>
    </View>
  );
};

type Props3 = {
  dateLabel: string;
  date: any;
  color: any;
  style: any;
};

const TimeContainer: FunctionComponent<Props3> = ({
  dateLabel,
  date,
  style,
  color,
}) => {
  return (
    <View style={styles.time_Container}>
      {dateLabel === 'Deadline' ? (
        <View style={[styles.date_container, timeTilestyle.date_text]}>
          <Label name={dateLabel} margin={4} style={undefined} />
          <AppSize width={5} height={undefined} />
          <Ionicons name={'pencil'} color={ColorConstants.primaryBlack} />
        </View>
      ) : (
        <Label name={dateLabel} margin={4} style={undefined} />
      )}
      <AppSize height={3} width={undefined} />
      <View style={[styles.date_container, style]}>
        <Ionicons name={'calendar'} color={color} />
        <AppSize width={5} height={undefined} />
        <Text style={[styles.date_text, style]}>{date}</Text>
      </View>
    </View>
  );
};

export {PersonTile, Tile, TimeTile, TimeContainer};

const timeTilestyle = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
  calenderStyle: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: ColorConstants.textLightBlack1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorConstants.primaryWhite,
  },
  date_text: {
    borderWidth: 0,
    borderColor: ColorConstants.textLightBlack1,
    paddingVertical: 0,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
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
    flex:1,
    paddingVertical: 5,
    backgroundColor: ColorConstants.primaryWhite,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorConstants.primaryBlack,
    fontFamily: FontConstants.semiBold,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: ColorConstants.teamHiColor,
    fontFamily: FontConstants.light,
  },
  divider: {
    height: 0.6,
    width: '100%',
    backgroundColor: ColorConstants.textLightBlack3,
  },
  tile_container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 15,
  },
  tile_text_style: {
    flex: 1,
    color: ColorConstants.primaryBlack,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FontConstants.semiBold,
  },
  tile_leading_icon: {
    height: 24,
    width: 24,
  },
});
