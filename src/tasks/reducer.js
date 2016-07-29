import genReducer from 'nsk-reducer';
import { taskActionTypes } from './actions';
import I from 'immutable';

// NOTE: In practice, these are the same, but they don't have to be.
// TODO: Error handling
const taskHandlers = I.Map({
  [taskActionTypes.CREATE]: (state, action) => {
    const task = action.payload.task;
    return state.set(task.id, task);
  },
  [taskActionTypes.UPDATE]: (state, action) => {
    const task = action.payload.task;
    return state.set(task.id, task);
  },
});

export default genReducer(I.Map(), taskHandlers);
