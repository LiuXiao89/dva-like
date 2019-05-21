import React, {useContext, useReducer} from 'react';
import {reducer, store, checkAsyncAction} from './reducers';

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
    return dispatch(action);
  } else {
    // 异步操作 略过 reducer
    const [namespace] = type.split('/');

    const put = (payload) => {
      dispatch({
        ...payload,
        type: `${namespace}/${payload.type}`,
      });
    };

    return asyncAction({put}, action);
  }
};


const MyProvider = ({children}) => {
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

export default MyProvider;

export {setStore, content, _store, useStore};
