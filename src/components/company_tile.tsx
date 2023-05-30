import React, {FunctionComponent} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConstants from '../constants/color_constants';
import {Label} from './label';
import {Avatar} from '@rneui/themed';
import Condition from './conditions';

type Props = {
  index: number;
  name: string;
  onPress: any;
  url: string;
};

const CompanyTile: FunctionComponent<Props> = ({name, onPress, url}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.inner_row}>
        {Condition.imageUrl(url) ? (
          <Avatar
            containerStyle={{
              borderRadius: 5,
            }}
            renderPlaceholderContent={<ActivityIndicator />}
            placeholderStyle={{
              backgroundColor: ColorConstants.primaryWhite,
            }}
            avatarStyle={{
              borderRadius: 5,
            }}
            source={{
              uri: url,
            }}
          />
        ) : (
          <View style={styles.image_container}>
            <Ionicons
              name={'business-outline'}
              size={18}
              style={styles.icon_style}
            />
          </View>
        )}
        <View style={styles.title_container}>
          <Label name={name} style={undefined} margin={undefined} />
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
