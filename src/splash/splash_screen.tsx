import React, {FunctionComponent} from 'react';
import {View, StyleSheet, ViewStyle, ImageStyle} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorConstants from '../constants/color_constants';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Image} from 'react-native';
import {HighLightLabel, Label, LightText} from '../components/label';
import FontConstants from '../constants/fonts';
import CommanFunctions from '../components/comman_functions';
import ColorsCondtion from '../components/color_condition';

type Props = {
  navigation: any;
};

const SplashSreen: FunctionComponent<Props> = ({navigation}) => {
  const routing = async () => {
    AsyncStorage.setItem('isFirstTime', 'true');
    CommanFunctions.routing(navigation, 'sign_in');
  };

  const slides = [
    {
      key: 1,
      title: 'Manage your projects' + '\n' + 'with some interesting UI.',
      text: 'Description.\nSay something cool',
      image: require('../../assets/images/splash.png'),
    },
    {
      key: 2,
      title: 'Manage your projects' + '\n' + 'with some interesting UI.',
      text: 'Other cool stuff',
      image: require('../../assets/images/splash.png'),
    },
    {
      key: 3,
      title: 'Manage your projects' + '\n' + 'with some interesting UI.',
      text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
      image: require('../../assets/images/splash.png'),
    },
  ];

  const _renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles({}).flex_container}>
        <Image source={item?.image} style={styles({}).imgBg} />
        <View style={styles({}).textContainer}>
          <HighLightLabel hightLightLabel={item.title} />
          <LightText
            lightText={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
              '\n' +
              'Magna neque ullamcorper varius duis dictum nibh facilisi mi.'
            }
          />
        </View>
      </View>
    );
  };

  const _renderSkipButton = (t: string) => {
    return (
      <Label
        name={t ? 'Skip' : 'Next'}
        style={styles({}).doneContainer}
        margin={0}
      />
    );
  };

  const _renderDoneButton = () => {
    return <Label name={'Done'} style={styles({}).doneContainer} margin={0} />;
  };

  return (
    <View style={styles({}).flex}>
      <AppIntroSlider
        data={slides}
        showDoneButton={true}
        onDone={() => routing()}
        onSkip={() => routing()}
        showSkipButton={true}
        renderItem={_renderItem}
        renderSkipButton={() => _renderSkipButton('skip')}
        renderNextButton={() => _renderSkipButton('')}
        renderDoneButton={_renderDoneButton}
        dotStyle={styles({d: 'inactive'}).dotStyle}
        activeDotStyle={styles({d: 'active'}).dotStyle}
      />
    </View>
  );
};

export default SplashSreen;

interface StylesProps {
  d?: string;
}

interface StyleSheetType {
  flex: ViewStyle;
  flex_container: ViewStyle;
  dotStyle: ViewStyle;
  imgBg: ImageStyle;
  textContainer: ViewStyle;
  container: ViewStyle;
  imageContainer: ViewStyle;
  bottomContainer: ViewStyle;
  doneContainer: ViewStyle;
}

type StylesFunctionProps = (props: StylesProps) => StyleSheetType;

const styles: StylesFunctionProps = ({d}) =>
  StyleSheet.create<StyleSheetType>({
    flex: {
      flex: 1,
    },
    flex_container: {
      flex: 1,
      justifyContent: 'center',
    },
    dotStyle: {
      backgroundColor: ColorsCondtion.dotColors(d),
    },
    imgBg: {
      height: 300,
      width: 300,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    textContainer: {
      marginTop: 25,
      alignSelf: 'center',
      width: '90%',
      marginBottom: 55,
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
    doneContainer: {
      color: ColorConstants.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: FontConstants.semiBold,
      fontWeight: '700',
      fontSize: 14,
      marginTop: 20,
    },
  });
