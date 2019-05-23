import {lazy} from 'react';
import {lazyLoad} from 'src/dva-like';


// 只需要注册页面时
const Page1 = lazy(() => import(/* webpackChunkName: "page1" */ 'src/pages/page1'));
const Page2 = lazy(() => import(/* webpackChunkName: "page2" */ 'src/pages/page2'));
const Page3 = lazy(() => import(/* webpackChunkName: "page3" */ 'src/pages/page3'));

// 需要注册 model 的页面
const Page4 = lazyLoad(
  () => import(/* webpackChunkName: "page4" */ 'src/pages/page4'),
  [() => import(/* dynamic model */ 'src/models/dynamic')],
);

export {
  Page1,
  Page2,
  Page3,
  Page4,
};
