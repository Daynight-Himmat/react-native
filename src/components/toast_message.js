import ColorConstants from '../constants/color_constants';

const toastMessage = (toast, message) => {
  toast.show(message,{
        type: 'normal',
        placement: 'bottom',
        offset: 30,
        duration: 3000,
        normalColor: ColorConstants.primaryBlack
      });
};

export default toastMessage;
