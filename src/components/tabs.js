import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import ColorConstants from '../constants/color_constants';

const TabContainer = ({onPress, condition, textCondition, buttonName}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles(condition, textCondition).tabContainer}>
      <Text style={styles(condition, textCondition).tabText}>{buttonName}</Text>
    </TouchableOpacity>
  );
};

const InnerTab = ({
  onPress,
  tabText,
  condition: tabCondition,
  textCondition,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles(tabCondition, textCondition).inner_container}>
      <Text style={styles(tabCondition, textCondition).inner_text}>
        {tabText}
      </Text>
      <View
        style={styles(tabCondition, textCondition).inner_bottom_container}
      />
    </TouchableOpacity>
  );
};

const styles = (condition, textCondition) =>
  StyleSheet.create({
    tabContainer: {
      height: 43,
      flexDirection: 'row',
      fontFamily: 'poppins',
      width: '50%',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 1,
      borderColor: textCondition,
      backgroundColor: condition,
    },
    tabText: {
      color: textCondition,
      fontSize: 20,
      fontWeight: '600',
    },
    inner_container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    inner_text: {
      color: textCondition,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      fontWeight: '600',
      paddingBottom: 2,
    },
    inner_bottom_container: {
      height: 5,
      width: '100%',
      paddingHorizontal: 2,
      paddingVertical: 2,
      borderRadius: 100,
      backgroundColor: condition,
    },
  });

export {TabContainer, InnerTab};
