import { ITask } from '../models/task';

export const recentFirst = (task1: ITask, task2: ITask): number => {
  const date1 = new Date(task1.createdAt);
  const date2 = new Date(task2.createdAt);

  // Compare the dates
  if (date1 > date2) {
    return -1; // The first task comes first
  } else if (date1 < date2) {
    return 1; // The second task comes first
  } else {
    return 0; // Dates are equal
  }
};

export const oldestFirst = (task1: ITask, task2: ITask): number => {
  const date1 = new Date(task1.createdAt);
  const date2 = new Date(task2.createdAt);

  // Compare the dates
  if (date1 > date2) {
    return 1; // The second task comes first
  } else if (date1 < date2) {
    return -1; // The first task comes first
  } else {
    return 0; // Dates are equal
  }
};
