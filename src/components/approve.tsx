import React, {FunctionComponent, useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Label} from './label';
import Condition from './conditions';

type Props = {
  navigation: any;
  route: any;
};

const Approved: FunctionComponent<Props> = ({navigation, route}) => {
  const {taskStatus} = route.params;

  useEffect(() => {
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  }, [navigation]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/approved.png')}
          style={styles.image}
        />
        <View style={styles.margin}>
          <Label
            name={`${Condition.getApprove(taskStatus)}`}
            style={styles.text}
            margin={0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorConstants.primaryWhite,
  },
  image: {
    height: 150,
    width: 150,
  },
  text: {
    textAlign: 'center',
  },
  margin: {margin: 20},
});

export default Approved;
