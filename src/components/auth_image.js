import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('screen');

const AuthImage = ({image}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 20,
  },
  image: {
    height: height / 4,
    width: width,
    resizeMode: 'contain',
  },
});

export default AuthImage;
