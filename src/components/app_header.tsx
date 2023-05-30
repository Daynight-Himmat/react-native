import React, {FunctionComponent} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {Appbar} from 'react-native-paper';
import FontConstants from '../constants/fonts';
const {width} = Dimensions.get('screen');

type Props = {
  text: string;
  navigate: any;
  action: any;
};

const AppHeader: FunctionComponent<Props> = ({text, navigate, action}) => {
  return (
    <Appbar.Header style={styles.headerStyles}>
      <Appbar.BackAction onPress={navigate} style={styles.backButton} />
      <Appbar.Content
        title={text}
        color={ColorConstants.primaryBlack}
        titleStyle={styles.headerText}
      />
      {action}
    </Appbar.Header>
  );
};

type Props1 = {
  title: string;
  pencilPress: any;
  deletePress: any;
  navigation: any;
};

const CommanHeader: FunctionComponent<Props1> = ({
  title,
  pencilPress,
  deletePress,
  navigation,
}) => {
  return (
    <Appbar.Header style={styles.headerStyles}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content
        title={title}
        color={ColorConstants.primaryBlack}
        titleStyle={styles.headerText}
      />
      <Appbar.Action icon="pencil" onPress={pencilPress} />
      <Appbar.Action
        icon="delete"
        color={ColorConstants.highLightColor}
        onPress={deletePress}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    width: width,
    backgroundColor: ColorConstants.primaryWhite,
  },
  backButton: {
    marginLeft: 0,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: ColorConstants.primaryBlack,
    fontFamily: FontConstants.semiBold,
  },
});

export {AppHeader, CommanHeader};
