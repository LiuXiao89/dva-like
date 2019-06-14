import React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {Switch, Route} from 'react-router';

import './animate.less';

// 如果不支持 history.state, 优雅降级为 pathname
const isSupportHistory = window.history && window.history.state;
// 路由栈, 里面可能是 stateKey | pathname (pathname 的时候是不保证路由动画准确的)
const routeStack = [];
// 是否是推入栈, 进入退出动画不一样
let isPush = true;

const setPush = (push) => { isPush = push; };

const pushStateKey = (key, path) => {
  const value = isSupportHistory ? key : path;
  routeStack[routeStack.length - 1] !== value && routeStack.push(value);
};

// 浏览器动作 | history.goBack 的原因产生的路由变化
// 只有这时候, 才可能是回退状态, 否则都是 push
window.addEventListener('popstate', () => {
  const curRouteVal = isSupportHistory ? window.history.state.key : window.location.pathname;

  const isBack = curRouteVal === routeStack[routeStack.length - 2];

  isPush = !isBack;
  isBack && routeStack.pop();
});
// 监听结束, 暴露 `setPush` 方法 给外部, 可以在某些特定的时候通知组件, 这次动画到底使用进入还是退出
// 当然, 外部可以不调用, 那么是不是push 状态只由组件从路由栈中判断, (可能会不准确, 当然基本不存在这种情况)


let globalHistory = null;

const getHistory = () => globalHistory;

// 以下为 render 函数
const config = {
  prefix: 'animate-router',
  routerKey: 'a-r-keyword',
  wrapper: 'animate-r-wrapper',
  container: 'animate-r-container',
};

const replaceClass = (node, actionType, prefix) => {
  if (!node) return;

  const actionMap = {
    enter: 'enter',
    entering: 'enter-active',
    entered: 'enter-done',
    exit: 'exit',
    exiting: 'exit-active',
    exited: 'exit-done',
  };

  node.className = `${config.container} ${prefix}-${isPush ? 'forward' : 'backward'}-${actionMap[actionType]}`;

  // push 状态重置回 true;
  if (actionType === 'entered') isPush = true;
};

const Animate = (props) => {
  const {location, history} = props;

  globalHistory = history;

  const {
    prefix = config.prefix,
    children,
    appear,
    transitionKeyFun,
    timeout = {enter: 280, exit: 217},
    ignorePath = [],
  } = props;

  const key = ignorePath.find(item => location.pathname.indexOf(item) === 0) || location.pathname;


  pushStateKey(window.history.state && window.history.state.key, location.pathname);

  const cssHooks = {
    onExit: n => replaceClass(n, 'exit', prefix),
    onExiting: n => replaceClass(n, 'exiting', prefix),
    onExited: n => replaceClass(n, 'exited', prefix),
    onEnter: n => replaceClass(n, 'enter', prefix),
    onEntering: n => replaceClass(n, 'entering', prefix),
    onEntered: n => replaceClass(n, 'entered', prefix),
  };

  return (
    <TransitionGroup
      className={config.wrapper}
      appear={appear}
    >
      <CSSTransition
        key={transitionKeyFun ? transitionKeyFun(location) : key}
        classNames={config.routerKey}
        timeout={timeout}
        {...cssHooks}
      >
        <div className={config.container}>
          <Switch location={location}>{children}</Switch>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export {
  setPush, routeStack, getHistory,
};

export default props => <Route render={r => <Animate {...r} {...props}/>}/>;
