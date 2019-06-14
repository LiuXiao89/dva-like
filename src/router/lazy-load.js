import {lazy} from 'react';

import {model} from 'src/dva-like';
import {loadCallback} from './helper';

/**
 * 传入页面 import 语句和 models import 数组, 返回一个 React.lazy symbol
 * 加载完成页面之后, 通知他完成
 * @param {Function} compPromise 组件的 import 语句
 * @param {Array[Function] | string} modelPromise models import 语句数组 (如果两个参数, 就是路由地址)

 * @returns {React.lazy} React lazy 组件
 */
const lazyLoad = (compPromise, modelPromise) => lazy(
  () => {
    return Promise.all(modelPromise ? modelPromise.map(imp => imp()) : [])
      .then((models) => { // 加载 models
        models.forEach((item) => {
          if (!item.default) {
            const e = new Error('you must use \'export default\' to export models!!!');
            console.error(e);
            console.warn(item);
            return;
          }
          model(item.default);
        });
      })
      .then(compPromise) // 执行 react.lazy, 返回 component .then(compPromise)
      .then((comp) => {
        loadCallback();
        return comp;
      });
  }

);

export default lazyLoad;
