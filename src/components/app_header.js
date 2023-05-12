import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {Appbar} from 'react-native-paper';
import FontConstants from '../constants/fonts';
const {width} = Dimensions.get('screen');

const AppHeader = ({
  text: title,
  navigate: navigation,
  action,
}) => {
  return (
    <Appbar.Header style={styles.headerStyles}>
      <Appbar.BackAction onPress={navigation} style={styles.backButton} />
      <Appbar.Content
        title={title}
        color={ColorConstants.primaryBlack}
        titleStyle={styles.headerText}
      />
      {action}
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

export default AppHeader;
