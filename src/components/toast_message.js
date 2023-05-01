import {ToastAndroid} from 'react-native';
class ToastMessage {
  static showMessage = message => {
    ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
  };
}

export default ToastMessage;
