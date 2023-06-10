import React, {FunctionComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConstants from '../constants/color_constants';

type Props = {
  value: string;
  onChangeText: ((text: string) => void);
  searchPress: any;
};

const SearchBox: FunctionComponent<Props> = ({
  value,
  onChangeText,
  searchPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inner_container}>
        <TextInput
          placeholder="Search"
          value={value}
          placeholderTextColor={ColorConstants.textLightBlack1}
          onChangeText={onChangeText}
          style={styles.input_text}
        />
        <View style={styles.icon_padding}>
          <TouchableOpacity onPress={searchPress}>
            <Ionicons
              name={'search'}
              size={18}
              color={ColorConstants.textHintColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorConstants.textFieldContainer,
    borderRadius: 4,
    paddingHorizontal: 5,
    height: 40,
    marginBottom: 10,
  },
  inner_container: {
    flexDirection: 'row',
  },
  icon_padding: {
    padding: 10,
    justifyContent: 'center',
  },
  input_text: {
    flex: 1,
    color: ColorConstants.primaryBlack,
  },
});

export default SearchBox;
