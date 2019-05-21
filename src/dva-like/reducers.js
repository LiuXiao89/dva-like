/**
 * models collection
 */
import {notifyConnects} from './use-connect.js';

const store = {}; // store 聚集地

const reducers = { // reducers 聚集地
  // 默认的, reducer 有一些方法可以用
  _set: (state, action) => ({...state, ...action.payload}),
};

const effects = {}; // effects 聚集地


/**
 * 公开出去的 reducer, 做一些常规操作
 * @param {*} state
 * @param {*} action
 */
const reducer = (state, action) => {
  const {type} = action;

  const [namespace, subType] = type.split('/');

  if (subType) {
    // 如果有subType , 说明该reducer是来自调用者
    // 来自调用者, 通知所有 connect 有变化
    if (reducers[type]) {
      const updateData = reducers[type](state[namespace], action);

      const nextState = {
        ...state,
        [namespace]: updateData,
      };

      store[namespace] = updateData;

      notifyConnects(nextState);

      return nextState;
    } else if (effects[type]) {
      // 本行代码已经在自定义 dispatch 里面实现了
      console.warn('副作用操作有误');

      // const {dispatch} = state;
      // const put = (payload) => {
      //   dispatch({
      //     ...payload,
      //     type: `${namespace}/${payload.type}`,
      //   });
      // };
      // effects[type]({put}, action);
    } else {
      console.warn(`can not find type: ${type} in reducers!`);
      return state;
    }
  }

  // 如果没有 subType, 说明该reducer是插件私有的东西
  if (!/^_/.test(type)) {
    throw new Error(`this action ${type} is illegal!`);
  }

  if (reducers[type]) {
    return reducers[type](state, action);
  }

  return state;
};


// 同步添加操作
const addReducer = (namespace, add) => {
  add && Object.keys(add).forEach((key) => {
    reducers[`${namespace}/${key}`] = add[key];
  });
};

const addEffect = (namespace, add) => {
  add && Object.keys(add).forEach((key) => {
    effects[`${namespace}/${key}`] = add[key];
  });
};

const addStore = (namespace, state) => {
  store[namespace] = state || {};
};

/**
 * 看看他是不是一个 effect 函数
 * @param {*} ctx
 * @return {boolean}
 */
const checkAsyncAction = (type) => effects[type];

export {
  reducer, store,
  addReducer, addEffect, addStore,
  checkAsyncAction,
};
