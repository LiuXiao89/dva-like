/**
 * models collection
 */
import {connectObserver} from './use-connect.js';
import {splitAction, splitType} from './utils';

const copyStore = {}; // 当 reset 的时候, 需要一个 copy 的 store;

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

  const [namespace, subType] = splitAction(action);

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

        connectObserver.notify(nextState);

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

  // 如果没有 subType, 说明该reducer是库私有 reducer, 也可能需要 call
  // 只有库私有 reducer 才不是一个 {}, 而是可以直接调用的函数
  // 调用完毕不会进行任何通知
  if (!/^_/.test(type)) {
    throw new Error(`
    this action ${type} is illegal!
    perhaps this is an effect, try to use {call} instead?
    `);
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

  // 如果没有 set 和 reset 方法, 自动添加. 否则使用自己定义的
  if (!add.set) {
    add.set = (state, action) => ({...state, ...action.payload});
  }

  if (!add.reset) {
    add.reset = state => ({...state, ...copyStore[namespace]});
  }
  // 添加完毕

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

  copyStore[namespace] = deepCopy(state);
};
// 添加操作完毕


// / helpers
/**
 * 检查这个 type 是否是一个 effect
 * @param {*} ctx
 * @return {boolean}
 */
const checkAsyncAction = (type) => {
  const [namespace, subType] = splitType(type);

  return namespace && subType && effects[namespace] && effects[namespace][subType];
};

/**
 * 深拷贝
 * @param {object} source 源对象
 * @returns {object} target 拷贝对象
 */
const deepCopy = (source) => {
  let target;
  const type = typeof source;
  const isArray = Array.isArray(source);

  if (!source) return source;

  if (isArray) {
    target = [];

    source.forEach((item, index) => {
      target[index] = deepCopy(item, null);
    });
  } else if (type === 'object') {
    target = {};

    Object.keys(source).forEach((key) => {
      target[key] = deepCopy(source[key], null);
    });
  } else {
    target = source;
  }

  return target;
};


export {
  reducer,
  store, reducers, effects,
  addReducer, addEffect, addStore,
  checkAsyncAction,
};
