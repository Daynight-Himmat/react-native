import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import ColorConstants from '../constants/color_constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const BottomSheet = ({widget, refer, backButton, buttonButton}) => {
  return (
    <SafeAreaView>
      <ActionSheet ref={refer}>
        <TouchableOpacity onPress={backButton} style={styles.backButton} />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}>
          {widget}
        </ScrollView>
        {buttonButton}
      </ActionSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 50,
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
