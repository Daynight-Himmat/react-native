import moment from "moment";
import ColorConstants from "../constants/color_constants";

abstract class TimeCondition{
    static monthDayYear = 'MMM DD, yyyy';
    static dayMonth = 'DD MMM';
    static full = 'DD/MM/YYYY hh:mm:ss a';
    static ymd = 'yyyy-MM-DD';
    static monthDayYearWithTime = 'MMM DD, yyyy hh:mm:ss a';
    static currentTime = moment().format(this.monthDayYear);
    static current = moment().utcOffset('+05:30').format(this.ymd);

    static monthDate = (date:string) => moment(date).format(this.monthDayYear);
    static onlyDayMouth = (date:string) => moment(date).format(this.dayMonth);
    static fullDate = (date: string) => moment(date, this.full).format(this.monthDayYearWithTime);

    static currentDateCheck = (date: string) => this.currentTime === moment(date, this.full).format(this.monthDayYear) ? ColorConstants.buttonGreenColor
    : ColorConstants.highPriorityColor;

    static dueDateCheck =(date:string)=> moment(date).format(this.ymd) !== this.current;
    static todayDateCheck =(date:string)=> moment(date).format(this.ymd) === this.current;
    
}

export default TimeCondition;