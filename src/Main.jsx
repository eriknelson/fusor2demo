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

const subs = {};

socket.on('message', (msg) => console.log('got message -> ', msg));
const socketMiddleware = socket => store => next => action => {
  const rx = /^([a-z]*?).([A-Z]*?)_FULFILLED/;
  const match = rx.exec(action.type);
  const isFulfilledPromise = !!match;

  const socketMeta = action.meta && action.meta.socket;

  // TODO: Explicit subscribe/unsubscribe handlers?
  //if(action.type === 'SOCKET_SUB') {
  //} else if(action.type === 'SOCKET_UNSUB') {
  //}

  // Can attach a socket action to a CRUD operation
  if(isFulfilledPromise && socketMeta) {
    const type = socketMeta.type;
    const modelName = match[1];
    const model = action.payload.data[modelName];

    if(type === 'sub') {
      console.log('subbing modelname... ' + modelName);

      if(!(modelName in subs)) {
        const cc = channel(modelName);
        subs[modelName] = cc;
        socket.on(cc, data => {
          store.dispatch({
            type: socketMeta.updateAction,
            payload: data[modelName]
          })
        });
      }
    } else if(type === 'unsub'){
      console.debug('unsubbing promise?');
    } else {
      throw 'ERROR: Unsupported socket action'
    }
  }

  // No socket action, pass through
  return next(action);
}

function channel(modelName) {
  return `/${modelName}`;
}

////////////////////////////////////////////////////////////
// Store Setup
////////////////////////////////////////////////////////////
const defaultState = {};
const rootReducer = combineReducers({
  tasks: tasksReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(
    //promiseMiddleware(), socketMiddleware(socket), loggerMiddleware())
    promiseMiddleware(), socketMiddleware(socket))
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
