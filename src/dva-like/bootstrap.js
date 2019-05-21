/**
 * 使用 useReducer useContext useMemo .. 等 模拟一个 dva
 */
import React from 'react';

import {addEffect, addReducer, addStore, store} from './reducers';

import Provider, {setStore, content} from './content';

// we register models like this
const registerModel = ({namespace, state, reducers, effects}) => {
  if (store[namespace]) return console.error(`store with namespace: ${namespace} is already exist!`);

  if (content.dispatch) {
    // 在异步增加model中过程, 唯有dispatch可以进行试图更新
    // 所以 '_' 开头的 没有 '/' 的 action, 都是私有的action
    content.dispatch({
      type: '_set',
      payload: {[namespace]: state},
    });
  }

  addStore(namespace, state);

  addReducer(namespace, reducers);

  addEffect(namespace, effects);
};

// and then we can start
// generate Provider, Consumer
// useReducer useContext
const start = (App) => {
  setStore();

  return () => (
    <Provider>
      <App />
    </Provider>
  );
};


export {
  registerModel as model, // 注册 models
  start, // 开始使用
};
