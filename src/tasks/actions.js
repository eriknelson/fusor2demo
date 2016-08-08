import axios from 'axios';
import { baseUrl } from '../shared/api';

const tasksUrl = `${baseUrl}/tasks`;

const taskActionTypes = {
  CREATE: 'tasks.CREATE',
  CREATE_FULFILLED: 'tasks.CREATE_FULFILLED',
  UPDATE: 'tasks.UPDATE'
};

const taskActions = {
  create: (task) => {
    return {
      type: taskActionTypes.CREATE,
      payload: axios.post(tasksUrl, {task})
    };
  },
  update: () => {
    return {
      type: taskActionTypes.UPDATE
    };
  }
};

export {
  taskActionTypes,
  taskActions
};
