import lazyLoad from './lazy-load';


// 只需要注册页面时
const Page1 = lazyLoad(() => import(/* webpackChunkName: "page1" */ 'src/pages/page1'));
const Page2 = lazyLoad(() => import(/* webpackChunkName: "page2" */ 'src/pages/page2'));

// 也可以直接使用 lazyLoad 单单注册页面
const Page3 = lazyLoad(() => import(/* webpackChunkName: "page3" */ 'src/pages/page3'));

// 需要注册 model 的页面
const Page4 = lazyLoad(
  () => import(/* webpackChunkName: "page4" */ 'src/pages/page4'),
  [() => import(/* webpackChunkName: "dynamic-model" */ 'src/models/dynamic')],
);

const asyncMap = {
  '/1': Page1,
  '/2': Page2,
  '/3': Page3,
  '/4': Page4,
};

export {
  Page1,
  Page2,
  Page3,
  Page4,
  asyncMap,
};
