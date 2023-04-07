import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';

const AuthImage = ({image}) => {
  const {height, width} = Dimensions.get('screen');
  return (
    <View style={styles.container}>
      <Image
        style={[
          styles.image,
          {
            height: height / 4,
            width: width,
          },
        ]}
        source={image}
      />
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
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },
});

export default AuthImage;
