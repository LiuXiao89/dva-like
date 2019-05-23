import {lazy} from 'react';
import {model} from './bootstrap';

export const splitAction = (action) => {
  const {type} = action;
  const reg = /^([^/]+)\/(.*)$/;

  const result = reg.exec(type);

  return result ?
    [result[1], result[2]] : [type];
};

// 整体延迟注册 页面和 models
/**
 * 传入页面 import 语句和 models import 数组, 返回一个 React.lazy symbol
 * @param {Array} modelPromise import 语句数组
 * @param {Function} compPromise import 语句
 * @returns {React.lazy} React lazy 组件
 */
export const lazyLoad = (compPromise, modelPromise) => {
  return lazy(() => Promise.all(modelPromise ? modelPromise.map(imp => imp()) : [])
    .then((models) => {
      models.forEach(item => {
        model(item.default);
      });
    })
    .then(compPromise));
};
