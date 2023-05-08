import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {Appbar} from 'react-native-paper';
const {width} = Dimensions.get('screen');

const AppHeader = ({text: title, navigate: navigation}) => {
  return (
    <Appbar.Header style={styles.headerStyles}>
      <Appbar.BackAction onPress={navigation} style={styles.backButton} />
      <Appbar.Content
        title={title}
        color={ColorConstants.primaryBlack}
        titleStyle={styles.headerText}
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
    fontWeight: '700',
    color: ColorConstants.primaryBlack,
  },
});

export default AppHeader;
