import React, {FunctionComponent} from 'react';
import {StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import ColorConstants from '../constants/color_constants';

type Props = {
  widget: any;
  refer: any;
  backButton: any;
  buttonButton: any;
};

const BottomSheet: FunctionComponent<Props> = ({
  widget,
  refer,
  backButton,
  buttonButton,
}) => {
  return (
    <ActionSheet ref={refer} useBottomSafeAreaPadding={true}>
      <TouchableOpacity onPress={backButton} style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.container}>{widget}</ScrollView>
      {buttonButton}
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  backButton: {
    height: 5,
    width: '45%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 100,
    backgroundColor: ColorConstants.primaryBlack,
  },
});

export default BottomSheet;
