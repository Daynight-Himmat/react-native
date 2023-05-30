class Condition {
  static StatusCondition = (status: string) =>
    status === 'Approved' || status === 'Completed';

  static BooleanCondition = (status: string) => {
    if (status === 'Approved' || status === 'Completed') {
      return false;
    } else {
      return true;
    }
  };

  static Completed = (status: string) => status === 'Completed';

  static Approved = (status: string) => status === 'Approved';

  static SingleCondition = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Task Completed';
      case 'Approved':
        return 'Task Approved';
    }
  };

  static Title = (title: string) => {
    if (title === '') {
      return 'No Data Found';
    } else {
      return title;
    }
  };

  static activeAndReopen = (status: string) =>
    status === 'Active' || status === 'Reopen';

  static imageUrl = (url: string) => url && url?.split('.').pop() === 'jpg';

  static getApprove = (status: any) => {
    switch (status) {
      case 'Approved':
        return ' Successfully Approved \n the task ';
      case 'Completed':
        return ' Successfully completed \n the task ';
      case 'Reopen':
        return ' Successfully Re-Open \n the task ';
      case 'Delete':
        return ' Successfully Delete \n the task ';
      case 'Priority':
        return ' Successfully Priority change \n the task ';
      default:
        return ' Successfully Update';
    }
  };
}

export default Condition;
