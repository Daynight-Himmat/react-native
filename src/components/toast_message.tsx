import {ToastType} from 'react-native-toast-notifications';
import ColorConstants from '../constants/color_constants';

const toastMessage = (toast: ToastType, message: string) => {
  toast.show(message, {
    type: 'normal',
    placement: 'bottom',
    duration: 3000,
    normalColor: ColorConstants.primaryBlack,
  });
};

export default toastMessage;
