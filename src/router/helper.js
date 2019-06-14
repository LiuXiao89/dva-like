import React, {Suspense} from 'react';
import ReactDom from 'react-dom';


import {asyncMap} from './page-map-async';

let lazyJump = null;
/**
 * 组件完全加载完毕之后, 回调路由系统
 * 仅仅支持一个页面异步加载, 不支持一次路由跳转, 加载多个页面!!
 * 若要加载多个资源, 需要将跳转页面路由需要加载的资源和已经加载好的资源进行比对,
 * 可以自行扩展
 */
const loadCallback = () => {
  setTimeout(() => {
    lazyJump && lazyJump();
    lazyJump = null;
  }, 0);
};

/**
 * 劫持route参数, 改写 history
 * @param {Object} route
 */
const hackHistory = (route) => {
  const {history} = route;
  const mix = {...history};

  const define = (key, getCb) => {
    Object.defineProperty(mix, key, {
      value(...args) {
        getCb(() => history[key](...args), ...args);
      },
    });
  };

  define('push', watchPush);
  define('replace', watchPush);
  define('goBack', watchBack);

  route.history = mix;
};

// 前进操作
const watchPush = (push, pathname) => {
  const LazyComp = asyncMap[pathname];
  const status = LazyComp && LazyComp._status;

  if (status === -1) {
    // 加载comp
    const div = document.createElement('div');
    ReactDom.render(<Suspense fallback={null}><LazyComp /></Suspense>, div);
    ReactDom.unmountComponentAtNode(div);

    lazyJump = () => push();
  } else {
    push();
  }
};

// 回退操作
const watchBack = (back) => {
  back();
};

export {
  loadCallback, hackHistory,
};

