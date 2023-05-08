import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import ColorConstants from '../constants/color_constants';
import FontConstants from '../constants/fonts';

const NoData = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.noDataText}>No data Found</Text>
    </View>
  );
};

const Loading = () => {
  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loading}>
        <ActivityIndicator size={35} color={ColorConstants.primaryColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FontConstants.semiBold,
    color: ColorConstants.primaryBlack,
  },
  loading: {
    height: 70,
    width: 70,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  loadingText: {
    color: ColorConstants.primaryBlack,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export {NoData, Loading};
