import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Label} from './label';

const Approved = ({navigation, route}) => {
  const {taskStatus} = route.params;
  const getApprove = () => {
    switch (taskStatus) {
      case 'Approved':
        return ' Successfully Approved \n the task ';
      case 'Completed':
        return ' Successfully completed \n the task ';
      case 'Reopen':
        return ' Successfully Re-Open \n the task ';
      case 'Delete':
        return ' Successfully Delete \n the task ';
      case 'Priority':
        return ' Successfully Priority change \n the task ';
      default:
        return ' Successfully Update';
    }
  };

  useEffect(() => {
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  }, [navigation]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/approved.png')}
          style={styles.image}
        />
        <View style={styles.margin}>
          <Label name={`${getApprove()}`} style={styles.text}/>
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
