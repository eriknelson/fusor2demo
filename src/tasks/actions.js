const taskActionTypes = {
  CREATE: 'tasks.CREATE',
  UPDATE: 'tasks.UPDATE'
};

const taskActions = {
  create: () => {
    return {
      type: taskTypes.CREATE
    }
  },
  update: () => {
    return {
      type: taskTypes.UPDATE
    }
  }
};

export {
  taskActionTypes,
  taskActions
};
