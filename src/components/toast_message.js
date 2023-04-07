import {ToastAndroid} from 'react-native';
import ColorConstants from '../constants/color_constants';

class ToastMessage {
  static showMessage = message => {
    ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
  };
}

export default ToastMessage;
