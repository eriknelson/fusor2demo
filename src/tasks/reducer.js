import genReducer from 'nsk-reducer';
import { taskActionTypes } from './actions';
import I from 'immutable';

// NOTE: In practice, these are the same, but they don't have to be.
// TODO: Error handling
const taskHandlers = I.Map({
  [taskActionTypes.CREATE_FULFILLED]: (state, action) => {
    const task = action.payload.data.task;
    return state.push(task);
  },
  [taskActionTypes.UPDATE]: (state, action) => {
    const task = action.payload.data.task;
    return state.push(task.id, task);
  },
});

export default genReducer(I.List(), taskHandlers);
