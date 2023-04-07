import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import AppButton from '../components/app_button';
import ColorConstants from '../constants/color_constants';
import {Label, HighLightLabel, LightText} from '../components/label';
import Swiper from 'react-native-swiper';
import AppSize from '../components/size';

const SplashSreen = ({navigation}) => {
  const {height, width} = Dimensions.get('screen');
  const [getIndex, setIndex] = useState();
  const goHome = async () => {
    var userId = await AsyncStorage.getItem('user_id');
    if (userId !== null) {
      navigation.navigate('dashboard');
    } else {
    }
  };

  useEffect(() => {
    console.log(height, width);
    // goHome();
  }, []);

  const slides = [
    {
      key: 1,
      title: 'Title 1',
      text: 'Description.\nSay something cool',
      image: require('../../assets/images/splash.png'),
      backgroundColor: ColorConstants.primaryWhite,
    },
    {
      key: 2,
      title: 'Title 2',
      text: 'Other cool stuff',
      image: require('../../assets/images/splash.png'),
      backgroundColor: ColorConstants.primaryWhite,
    },
    {
      key: 3,
      title: 'Rocket guy',
      text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
      image: require('../../assets/images/splash.png'),
      backgroundColor: ColorConstants.primaryWhite,
    },
  ];

  return (
    <SafeAreaView>
      <View
        style={[
          styles.container,
          {
            // height: height,
            // width: width,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
          },
        ]}>
        <Swiper
          loop={false}
          index={getIndex}
          total={slides.length}
          showsPagination={true}
          dotStyle={{
            marginBottom: -10,
          }}
          onIndexChanged={index => {
            console.log(index);
            setIndex(index);
          }}
          style={styles.wrapper}>
          {slides.map((slide, index) => {
            return (
              <View
                key={index}
                style={{
                  height: height,
                  width: width,
                  flexDirection: 'column',
                  backgroundColor: slide.backgroundColor,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <View style={{flex: 1}} />
                <Image
                  source={slide.image}
                  style={{
                    width: '100%',
                    height: 400,
                    resizeMode: 'contain',
                  }}
                />
                <AppSize height={10} />
                <View
                  style={{
                    width: width,
                    flexDirection: 'column',
                    backgroundColor: slide.backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  <HighLightLabel
                    hightLightLabel={
                      'Manage your projects' +
                      '\n' +
                      'with some interesting UI.'
                    }
                  />
                  <LightText
                    lightText={
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                      '\n' +
                      'Magna neque ullamcorper varius duis dictum nibh facilisi mi.'
                    }
                  />
                </View>
                <View style={{flex: 1}} />
                <AppSize height={160} />
              </View>
            );
          })}
        </Swiper>
        <View
          style={{
            // position: 'absolute',
            // bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            flexDirection: 'row',
            backgroundColor: ColorConstants.primaryWhite,
          }}>
          <AppButton
            text={'Register'}
            style={{
              flex: 1,
              backgroundColor: ColorConstants.primaryWhite,
              borderColor: ColorConstants.primaryColor,
              borderWidth: 2,
              borderRadius: 5,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{
              color: ColorConstants.primaryColor,
            }}
            onPress={
              () => {
                navigation.navigate('sign_up');
              }
            }
          />
          <AppSize width={20} />
          <AppButton 
            text={'Log In'} 
            style={{flex: 1}} 
            onPress={
              () => {
                navigation.navigate('sign_in');
              }
            }
          
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashSreen;

const styles = StyleSheet.create({
  wrapper: {
    // height: '100%',
    // width: '100%',
    // backgroundColor: 'white',
  },
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  bottomContainer: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
  },
  button_register: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: ColorConstants.primaryColor,
    backgroundColor: 'white',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_logIn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: ColorConstants.primaryColor,
    backgroundColor: ColorConstants.primaryColor,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botton_Sign_up_button: {
    color: ColorConstants.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  botton_LogIn_button: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
