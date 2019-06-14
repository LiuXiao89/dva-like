import React from 'react';

import {addEffect, addReducer, addStore, store} from './reducers';

import Provider, {setStore, content} from './content';

// we register models like this
const registerModel = ({namespace, state, reducers, effects}) => {
  // 不能以下划线开头
  if (/^_/.test(namespace)) {
    return console.error(`namespace 不能以下划线开头: ${namespace}`);
  }

  // 添加之前, 首先验证是否已经注册过, 然后验证是否有同名函数
  if (store[namespace]) {
    throw new Error(`store with namespace: ${namespace} is already exist!`);
  }

  reducers && effects && Object.keys(reducers).forEach((key) => {
    if (effects[key]) {
      throw new Error(`the namespace ${namespace} has the same key ${key} in reducers and effects!`);
    }
  });

  // 在异步增加model中过程(已经注册完成), 唯有dispatch可以进行视图更新
  // 约定: '_' 开头的 没有 '/' 的 action, 都是私有的action
  if (content.dispatch) {
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

  const DvaContent = () => (
    <Provider>
      <App />
    </Provider>
  );

  return DvaContent;
};


export {
  registerModel as model, // 注册 models
  start, // 开始使用
};
