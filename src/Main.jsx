import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import tasksReducer from './tasks/reducer';
import Layout from './base/components/Layout';

import './shared/styles/fusor2demo.scss';

////////////////////////////////////////////////////////////
// socket.io
////////////////////////////////////////////////////////////
import io from 'socket.io-client';
const socket = io();
socket.on('message', (msg) => console.log('got message -> ', msg));

////////////////////////////////////////////////////////////
// Store Setup
////////////////////////////////////////////////////////////
const defaultState = {};
const rootReducer = combineReducers({
  tasks: tasksReducer
});

const socketMiddleware = socket => store => next => action => {
  const socketAction = action.payload && action.payload.socket;
  console.debug(`socketAction::${socketAction}`);

  // TODO: Direct subscribe/unsubscribe handlers?
  if(action.type === 'SOCKET_SUB') {
  } else if(action.type === 'SOCKET_UNSUB') {
  }

  // Can attach a socket action to a CRUD operation
  if(socketAction) {
    const type = socketAction.type;

    if(type === 'SUB') {
      console.debug('subscribing to...', socketAction.event);
      socket.on(socketAction.event, (data) => {
        console.debug('SOCKET MIDDLEWARE TICK', data);
        // TODO: Update state tree with socket payload
      });
    } else if(type === 'UNSUB'){
      console.debug('unsubbing...', socketAction.event);
      socket.off(socketAction.event);
    } else {
      throw 'ERROR: Unsupported socket action'
    }
  }

  // No socket action, pass through
  return next(action);
}

const store = createStore(
  rootReducer,
  applyMiddleware(
    promiseMiddleware(), socketMiddleware(socket), loggerMiddleware())
);

////////////////////////////////////////////////////////////
// React Setup
////////////////////////////////////////////////////////////
const app =
  <Provider store={store}>
    <Layout />
  </Provider>

const mountPoint = document.getElementById('main');
ReactDOM.render(app, mountPoint);
