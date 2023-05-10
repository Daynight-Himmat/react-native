import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import ColorConstants from '../constants/color_constants';
import {Label} from './label';
import {Tile} from './person_tile';
import DeleteSvg from '../../assets/images/delete.svg';
import Priority from '../../assets/images/priority.svg';
import Approved from '../../assets/images/approved_task.svg';
import Reopen from '../../assets/images/reopen.svg';
import CompleteTaskIcon from '../../assets/images/complete.svg';
import Assignee from '../../assets/images/assignee.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSheet from './bottom_sheet';
import {Ionicons} from './icons';

const TaskOption = ({
  status,
  scrollHandlers,
  navigation,
  onPressPriority,
  onPressChangeAssignee,
  onPressComplete,
  onPressDelete,
  onPressReopen,
  onPressApproved,
}) => {
  return (
    <View>
      <Label name={'Task Options'} />
      {status !== 'Completed' && (
        <Tile
          widget={<Priority height={15} widget={15} />}
          title={'Change Priority'}
          divider={0.5}
          tailer={true}
          onPress={onPressPriority}
          textStyle={styles.labelstyles}
        />
      )}

      {status !== 'Completed' ? (
        <Tile
          widget={<CompleteTaskIcon height={15} widget={15} />}
          title={'Mark as Complete'}
          divider={0.5}
          tailer={true}
          onPress={onPressComplete}
          textStyle={styles.labelstyles}
        />
      ) : (
        <Tile
          widget={<Approved height={15} widget={15} />}
          title={'Mark as Approve'}
          divider={0.5}
          tailer={true}
          onPress={onPressApproved}
          textStyle={styles.labelstyles}

        />
      )}
      {status !== 'Completed' ? (
        <Tile
          widget={<Assignee height={15} widget={15} />}
          title={'Change Assignee'}
          divider={0.5}
          tailer={true}
          onPress={onPressChangeAssignee}
          textStyle={styles.labelstyles}
        />
      ) : (
        <Tile
          widget={<Reopen height={15} widget={15} />}
          title={'Mask as Reopen'}
          divider={0.5}
          tailer={true}
          onPress={onPressReopen}
          textStyle={styles.labelstyles}
        />
      )}

      <Tile
        widget={<DeleteSvg height={15} widget={15} />}
        title={'Delete Task'}
        textStyle={{color: ColorConstants.highLightColor}}
        divider={0.5}
        tailer={true}
        color={ColorConstants.highLightColor}
        onPress={onPressDelete}
        textStyle={styles.labelstyles}
      />
    </View>
  );
};

export default TaskOption;

const styles = StyleSheet.create({
  scrollview: {
    width: '100%',
    padding: 12,
    paddingBottom: 20,
  },
  labelstyles: {
    flex: 1
  }
});
