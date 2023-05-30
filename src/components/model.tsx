import React, {FunctionComponent} from 'react';
import {StyleSheet, View} from 'react-native';

type Props = {
  widget: any;
};

const ModelView: FunctionComponent<Props> = ({widget}) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>{widget}</View>
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
});

export default ModelView;
