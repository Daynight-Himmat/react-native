import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import ColorConstants from '../constants/color_constants';
import FontConstants from '../constants/fonts';
import {Calendar} from 'react-native-calendars';
import AppButton from './app_button';
import RowButton from './row_button';

const CalenderContainer = ({
  date: currentDate,
  deadline: selectDate,
  onDayPress: onPress,
  onSelect: buttonPress,
  onCancal: onCancel,
}) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Calendar
          minDate={currentDate}
          initialDate={currentDate}
          onDayPress={onPress}
          markedDates={{
            [selectDate]: {
              selected: true,
              selectedDotColor: 'orange',
              selectedColor: ColorConstants.primaryColor,
            },
          }}
          theme={styles.theme}
        />
        <RowButton text={'Select'} onPress={buttonPress} onback={onCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 10,
  },
  modalView: {
    margin: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 100,
  },
  theme: {
    backgroundColor: ColorConstants.primaryWhite,
    calendarBackground: ColorConstants.primaryWhite,
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: ColorConstants.primaryColor,
    selectedDayTextColor: ColorConstants.primaryWhite,
    todayTextColor: ColorConstants.primaryColor,
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: ColorConstants.primaryColor,
    arrowColor: ColorConstants.primaryColor,
    disabledArrowColor: '#d9e1e8',
    monthTextColor: ColorConstants.primaryColor,
    indicatorColor: 'blue',
    textDayFontFamily: FontConstants.semiBold,
    textMonthFontFamily: FontConstants.semiBold,
    textDayHeaderFontFamily: FontConstants.ragular,
    textDayFontWeight: '700',
    textDayHeaderFontWeight: '600',
    textDayFontSize: 12,
    textMonthFontSize: 14,
    textDayHeaderFontSize: 14,
  },
  bottomButton: {
    width: '100%',
    
    padding: 10,
    flexDirection: 'row',
  },
});

export default CalenderContainer;
