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

const store = createStore(
  rootReducer,
  applyMiddleware(promiseMiddleware(), loggerMiddleware())
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
