import axios from 'axios';
import { baseUrl } from '../shared/api';

const tasksUrl = `${baseUrl}/tasks`;

const taskActionTypes = {
  CREATE: 'task.CREATE',
  CREATE_FULFILLED: 'task.CREATE_FULFILLED',
  UPDATE: 'task.UPDATE'
};

const taskActions = {
  create: (task) => {
    console.log('creating task')
    return {
      type: taskActionTypes.CREATE,
      payload: axios.post(tasksUrl, {task}),
      meta: {
        socket: {
          type: 'sub',
          updateAction: taskActionTypes.UPDATE
        }
      }
    };
  },
  update: (task) => {
    return {
      type: taskActionTypes.UPDATE,
      payload: task
    };
  }
};

export {
  taskActionTypes,
  taskActions
};
