import {ToastAndroid, Platform} from 'react-native';
class ToastMessage {
  static showMessage = message => {
    if(Platform.OS === 'ios'){
      
    }
    else {
      ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
    }
  };
}

export default ToastMessage;
