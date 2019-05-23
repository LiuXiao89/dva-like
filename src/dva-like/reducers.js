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
    const subReducer = reducers[namespace];

    if (!subReducer) {
      const e = new Error(`did you register model with namespace:${namespace}?`);
      console.error(e);
      return state;
    }

    if (subReducer[subType]) {
      // 开始调用 reducer..
      // reducer是纯净的, 他只应该接受 state 和 action, 并返回一个新的(本地)store,
      // 禁止在 reducer 内调用 dispatch(因为 dispatch 可能产生副作用)

      // 1. 通知 react 视图变化
      // 2. 更改本地维护的store (connect需要他)
      // 3. 通知 useConnect 需要更新试图, useConnect 接收所有变更, 对比当前依赖, 判断是否update子组件
      try {
        // 增加错误捕获
        const updateData = subReducer[subType](state[namespace], action);

        const nextState = {
          ...state,
          [namespace]: updateData,
        };

        store[namespace] = updateData;

        notifyConnects(nextState);

        return nextState;
      } catch (e) {
        console.error(e);
        return state;
      }
    } else {
      console.warn(`can not find type: ${type} in reducers!`);
      return state;
    }
  }

  // 如果没有 subType, 说明该reducer是库私有 reducer
  // 只有库私有 reducer 才不是一个 {}, 而是可以直接调用的函数
  // 调用完毕不会进行任何通知
  if (!/^_/.test(type)) {
    throw new Error(`this action ${type} is illegal!`);
  }

  if (reducers[type]) {
    return reducers[type](state, action);
  }

  throw new Error(`unKnow error with dva-like;  type: ${type}, action: ${JSON.stringify(action)}`);
};


// 同步添加操作
const addReducer = (namespace, add) => {
  const local = {};
  reducers[namespace] = local;

  add && Object.keys(add).forEach((key) => {
    local[key] = add[key];
  });
};

const addEffect = (namespace, add) => {
  const local = {};
  effects[namespace] = local;

  add && Object.keys(add).forEach((key) => {
    local[key] = add[key];
  });
};

const addStore = (namespace, state) => {
  store[namespace] = state || {};
};
// 添加操作完毕

/**
 * 检查这个 action 是否是一个 effect
 * @param {*} ctx
 * @return {boolean}
 */
const checkAsyncAction = (type) => {
  const [namespace, subType] = type.split('/');

  return namespace && subType && effects[namespace] && effects[namespace][subType];
};


export {
  reducer,
  store, reducers, effects,
  addReducer, addEffect, addStore,
  checkAsyncAction,
};
