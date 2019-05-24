import React, {useContext, useReducer} from 'react';
import {reducer, reducers, effects, store, checkAsyncAction} from './reducers';
import {splitAction} from './utils';

const content = {}; // 内部使用

const _store = {}; // 公开

const setStore = () => {
  const ctx = React.createContext(store);

  content.Provider = ctx.Provider;
  content.Consumer = ctx.Consumer;
  content.globalContext = ctx; // create context
  content.store = store; // 数据

  _store.ctx = ctx;
  _store._store = store;
  _store._reducer = reducer;
};


let dispatch = null;

const dvaDispatch = action => {
  if (!dispatch) return console.error('dispatch 还没有注册!');

  const {type} = action;

  const asyncAction = checkAsyncAction(type);

  if (!asyncAction) {
    // 同步操作, 直接调用 dispatch (reducers)
    return dispatch(action);
  } else {
    // 异步操作 略过 reducer
    // 注入加工过的 put call, 由该副作用主动调用 dispatch
    // 如果本地有同名函数, 先调用本地, 然后全局, 最后抛错
    const [namespace] = type.split('/');

    const put = (ac) => {
      const isLocalReducer = reducers[namespace][ac.type];

      dispatch({
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

      return effect({put, call}, ac)
        .catch(e => console.error('dva-like catch error:', e));
    };

    return asyncAction({put, call}, action)
      .catch(e => console.error('dva-like catch error:', e));
  }
};


const DvaProvider = ({children}) => {
  const {Provider, globalContext} = content;

  const ctxData = useContext(globalContext);

  const [state, _dispatch] = useReducer(reducer, ctxData);

  dispatch = _dispatch;

  state.dispatch = dvaDispatch; // 存入global
  _store._dispatch = dvaDispatch; // 公开
  content.dispatch = dvaDispatch; // 私有

  return (
    <Provider value={state}>
      {children}
    </Provider>
  );
};

const useStore = () => useContext(content.globalContext);

export default DvaProvider;

export {setStore, content, _store, useStore};
