import React, {FunctionComponent} from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ColorConstants from "../constants/color_constants";
import FontConstants from "../constants/fonts";

type Props = {
    placeholder: string, 
    value: any, 
    data: any, 
    labelField: string, 
    valueField: string, 
    onChange: any,
    searchPlaceHolder: any,
    isSearch: boolean,
};

const DropDownMenu: FunctionComponent<Props> = ({placeholder, isSearch, searchPlaceHolder, value, data, labelField, valueField, onChange}) => {
    return <Dropdown 
    data={data}
    itemTextStyle={styles.itemTextStyle}
    placeholder={placeholder}
    placeholderStyle={styles.placeholderStyle}
    value={value}
    labelField={labelField}
    valueField={valueField}
    selectedTextStyle={styles.itemTextStyle}
    onChange={onChange}
    searchPlaceholder={searchPlaceHolder}
    search={isSearch}
    style={styles.containerStyle}
  />
}

const styles = StyleSheet.create({
    placeholderStyle:{
        color: ColorConstants.textHintColor,
        fontFamily: FontConstants.ragular,
        fontSize: 14
    },
    itemTextStyle:{
        color: ColorConstants.primaryBlack,
        fontFamily: FontConstants.ragular,
        fontSize: 14,
    },
    containerStyle: {
        fontFamily: FontConstants.semiBold,
        borderColor: ColorConstants.textLightBlack3,
        height: 48,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: ColorConstants.primaryWhite,
        padding: 10
      }
});

export default DropDownMenu;