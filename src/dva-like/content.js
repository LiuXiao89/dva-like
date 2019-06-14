import React, {useContext, useReducer} from 'react';
import {reducer, reducers, effects, store, checkAsyncAction} from './reducers';
import {splitAction} from './utils';

let reactDispatch = null; // react dispatch

const content = {}; // 内部使用

const _store = {}; // 公开

const setStore = () => {
  const ctx = React.createContext(store);

  content.Provider = ctx.Provider;
  content.Consumer = ctx.Consumer;
  content.globalContext = ctx; // create context
  content.store = store; // 数据

  // 初始的时候需要一个 dispatch, 来进行 react 渲染前的数据更改

  _store.ctx = ctx;
  _store._store = store;
  _store._reducer = reducer;

  _store._dispatch = dvaDispatch; // 公开
  content.dispatch = dvaDispatch; // 私有
};

// 渲染之前的 dispatch
// 每次完成之后, 都需要生成一次新的 ctx
const _storeDispatch = (action) => {
  const {type} = action;

  const [namespace, subType] = type.split('/');

  const asyncAction = checkAsyncAction(type);

  if (!namespace || !subType) {
    console.error(`can't dispatch with action ${JSON.stringify(action)}`);
    return;
  }

  if (!asyncAction) {
    const nextState = reducer(store, action);

    store[namespace] = nextState[namespace];
    // 完成之后, 需要重新设置store
    setStore();
  } else {
    _storeEffect(asyncAction, action, namespace);
  }
};

// 通用的effect
// 异步操作 略过 reducer
// 注入加工过的 put call, 由该副作用主动调用 dispatch
// 如果本地有同名函数, 先调用本地, 然后全局, 最后抛错
const _storeEffect = (asyncAction, action, namespace) => {
  const _dispatch = reactDispatch || _storeDispatch;

  const put = (ac) => {
    const isLocalReducer = reducers[namespace][ac.type];

    _dispatch({
      ...ac,
      type: isLocalReducer ? `${namespace}/${ac.type}` : ac.type,
    });
  };

  const call = (ac) => {
    const [n, t] = splitAction(ac);
    const localEffect = effects[namespace][ac.type];

    const globalEffect = effects[n] && effects[n][t];

    const effect = localEffect || globalEffect;

    if (!effect) {
      console.error(new Error(`can't find effect '${ac.type}'.
                        namespace: '${namespace}',
                        action: ${JSON.stringify(action)},
                        subAction: ${JSON.stringify(ac)}
                        `));
    }

    return effect(ac, {put, call})
      .catch(e => console.error('dva-like catch error:', e));
  };

  return asyncAction(action, {put, call})
    .catch(e => console.error('dva-like catch error:', e));
};

/**
 * 在这里, 需要认清dispatch注册与否.
 * @param {object} action
 */
const dvaDispatch = (action) => {
  const _dispatch = reactDispatch || _storeDispatch;

  const {type} = action;

  const asyncAction = checkAsyncAction(type);

  if (!asyncAction) {
    // 同步操作, 直接调用 dispatch (reducers)
    return _dispatch(action);
  } else {
    const [namespace] = type.split('/');

    return _storeEffect(asyncAction, action, namespace);
  }
};


const DvaProvider = ({children}) => {
  const {Provider, globalContext} = content;

  const ctxData = useContext(globalContext);


  const [state, _dispatch] = useReducer(reducer, ctxData);

  reactDispatch = _dispatch;

  state.dispatch = dvaDispatch; // 存入global

  return (
    <Provider value={state}>
      {children}
    </Provider>
  );
};

const useStore = () => useContext(content.globalContext);

export default DvaProvider;

export {setStore, content, _store, useStore};
