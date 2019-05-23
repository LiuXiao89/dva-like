import React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {Switch} from 'react-router';

import {useRouter} from 'src/hooks/use-router';

import './animate.less';

/* 监听是否是 Push 状态 */
const stateKeyStack = [];
let isPush = true;

const setPush = push => { isPush = push; };

const pushStateKey = (key) => {
  stateKeyStack[stateKeyStack.length - 1] !== key && stateKeyStack.push(key);
};

window.addEventListener('popstate', () => {
  if (!window.history.state) return;
  if (window.history.state.key === stateKeyStack[stateKeyStack.length - 2]) {
    isPush = false;
    stateKeyStack.pop();
  } else {
    isPush = true;
  }
});
/* 监听结束, 暴露 setPush 方法 给外部, 在每次push 页面的时候通知该组件 */
/* 当然, 外部可以不调用, 那么是不是push 状态只能组件从路由栈中判断, 不一定准确 */

const config = {
  prefix: 'animate-router',
  routerKey: 'a-r-keyword',
  wrapper: 'animate-r-wrapper',
  container: 'animate-r-container',
};

const replaceClass = (node, actionType) => {
  if (!node) return;
  const {prefix} = config;

  const actionMap = {
    enter: 'enter',
    entering: 'enter-active',
    entered: 'enter-done',
    exit: 'exit',
    exiting: 'exit-active',
    exited: 'exit-done',
  };

  node.className = `${config.container} ${prefix}-${isPush ? 'forward' : 'backward'}-${actionMap[actionType]}`;
};

const cssHooks = {
  onExit: n => replaceClass(n, 'exit'),
  onExiting: n => replaceClass(n, 'exiting'),
  onExited: n => replaceClass(n, 'exited'),
  onEnter: n => replaceClass(n, 'enter'),
  onEntering: n => replaceClass(n, 'entering'),
  onEntered: n => replaceClass(n, 'entered'),
};


const Animate = (props) => {
  const router = useRouter();

  const {location} = router;

  const {
    prefix,
    children,
    appear,
    transitionKeyFun,
    timeout = {enter: 280, exit: 217},
    ignorePath = [],
  } = props;

  if (prefix && config.prefix !== prefix) config.prefix = prefix;

  const key = ignorePath.find(item => location.pathname.indexOf(item) !== -1) || location.pathname;

  pushStateKey(window.history.state && window.history.state.key);


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
  setPush,
};

export default Animate;
