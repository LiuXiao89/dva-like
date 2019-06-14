/**
 * 使用 useReducer useContext useMemo .. 等 模拟 dva 环境
 */
import React from 'react';

import {_store, useStore} from './content';

import {connect} from './connect';

import {model, start} from './bootstrap';

import useConnect from './use-connect';

{
  // validate version
  const {version} = React;

  const v = version.split('.').join('').substr(0, 3);

  if (v < 168) console.error('dva-like is only support in React version upper than 16.8, please update your React');
}


export {
  model, // 注册 models
  start, // 开始使用

  // 公开一些方法出去. ctx: Context; _store: store对象; _reducer: reducer; _dispatch: dispatch;
  _store as store,

  connect, // 连接部分store (高阶组件, 使用不方便, 但是class组件只能用它)

  useStore, // 使用整个store
  useConnect, // use 部分 store
};
