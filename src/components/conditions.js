import ColorConstants from '../constants/color_constants';

class Condition {
  static StatusCondition = status =>
    status === 'Approved' || status === 'Completed';

  static BooleanCondition = status => {
    if (status === 'Approved' || status === 'Completed') {
      return false;
    } else {
      return true;
    }
  };

  static Completed = status => status === 'Completed';

  static Approved = status => status === 'Approved';

  static SingleCondition = status => {
    switch (status) {
      case 'Completed':
        return 'Task Completed';
      case 'Approved':
        return 'Task Approved';
    }
  };

  static Title = title => {
    if (title === '') {
      return 'No Data Found';
    } else {
      return title;
    }
  };

  static activeAndReopen = status => status === 'Active' || status === 'Reopen';

  static imageUrl = url => url && url?.split('.').pop() === 'jpg';
}

export default Condition;
