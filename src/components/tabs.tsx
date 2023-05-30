import React, {FunctionComponent} from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import FontConstants from '../constants/fonts';

type Props = {
  onPress: any;
  condition: any;
  textCondition: any;
  buttonName: string;
};

const TabContainer: FunctionComponent<Props> = ({
  onPress,
  condition,
  textCondition,
  buttonName,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles(condition, textCondition).tabContainer}>
      <Text style={styles(condition, textCondition).tabText}>{buttonName}</Text>
    </TouchableOpacity>
  );
};

type Props1 = {
  onPress: any;
  tabText: any;
  condition: any;
  textCondition: string;
};

const InnerTab: FunctionComponent<Props1> = ({
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

const styles = (condition: any, textCondition: string) =>
  StyleSheet.create({
    tabContainer: {
      height: '100%',
      flexDirection: 'row',
      width: '50%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      borderColor: textCondition,
      backgroundColor: condition,
    },
    tabText: {
      color: textCondition,
      fontFamily: FontConstants.ragular,
      fontSize: 14,
      fontWeight: '700',
    },
    inner_container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inner_text: {
      color: textCondition,
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: '600',
      paddingBottom: 2,
      fontFamily: FontConstants.semiBold,
    },
    inner_bottom_container: {
      height: 5,
      width: '100%',
      paddingHorizontal: 2,
      paddingVertical: 2,
      marginTop: 2,
      borderRadius: 100,
      backgroundColor: condition,
    },
  });

export {TabContainer, InnerTab};
