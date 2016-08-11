import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
//import loggerMiddleware from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import tasksReducer from './tasks/reducer';
import Layout from './base/components/Layout';

import merge from 'merge';

import './shared/styles/fusor2demo.scss';

////////////////////////////////////////////////////////////
// socket.io
////////////////////////////////////////////////////////////
import io from 'socket.io-client';
const socket = io();

const sockets = {};

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

      const totalTickCount = genTickCount();
      const tickPeriod = genTickPeriod();

      const tick = () => {
        const sub = sockets[model.id];
        let progress;

        if(sub.tickCount === totalTickCount) {
          clearInterval(sub.interval);
          progress = 1;
        } else {
          progress = (sub.tickCount++ / totalTickCount).toPrecision(2);
        }

        const updatedTask = merge(model, {progress});

        store.dispatch({
          type: socketMeta.updateAction,
          payload: updatedTask
        })
      };

      const sub = {
        interval: setInterval(tick, tickPeriod),
        tickCount: 0
      };

      sockets[model.id] = sub;

      //socket.on(channel(modelName, model.id), (data) => {
        //// Update store with new data
        //const progress = data[modelName].progress;
        //store.dispatch({
          //type: socketMeta.updateAction,
          //payload: data[modelName]
        //})
      //});

    } else if(type === 'unsub'){
      console.debug('unsubbing promise?');
    } else {
      throw 'ERROR: Unsupported socket action'
    }
  }

  // No socket action, pass through
  return next(action);
}

function channel(modelName, modelId) {
  return `/${modelName}/${modelId}`;
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

////////////////////////////////////////////////////////////
// DEBUG
////////////////////////////////////////////////////////////
function genTickCount() {
  return randint(8, 17);
}

function genTickPeriod() {
  return randint(500, 1200);
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
////////////////////////////////////////////////////////////
