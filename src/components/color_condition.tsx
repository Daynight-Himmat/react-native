import ColorConstants from '../constants/color_constants';

abstract class ColorsCondtion {
  static condition = (side: string, type: string) =>
    side === type ? ColorConstants.primaryColor : ColorConstants.primaryWhite;

  static textCondition = (side: string, type: string) =>
    side === type ? ColorConstants.primaryColor : ColorConstants.teamHiColor;

  static getColor = (data: any) => {
    switch (data.task_status) {
      case 'Completed':
        return ColorConstants.yellowCompleteColor;
      case 'Active':
        return data.priority === 'High'
          ? ColorConstants.highPriorityColor
          : ColorConstants.lowPriorityColor;
      case 'Reopen':
        return data.priority === 'High'
          ? ColorConstants.highPriorityColor
          : ColorConstants.lowPriorityColor;
      case 'Approved':
        return ColorConstants.buttonGreenColor;
    }
  };

  static dotColors = (d: any) =>
    d === 'inactive'
      ? ColorConstants.textLightBlack3
      : ColorConstants.primaryColor;
}

export default ColorsCondtion;
