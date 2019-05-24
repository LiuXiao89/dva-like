import {lazy} from 'react';
import {model} from './bootstrap';

/**
 * 返回当前 type 的 namespace 和 subType
 * @param {object} action 拆分他的 type
 */
export const splitAction = (action) => {
  const {type} = action;
  const reg = /^([^/]+)\/(.*)$/;

  const result = reg.exec(type);

  return result ?
    [result[1], result[2]] : [type];
};

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

/**
 * use-connect 使用
 * add 和 delete 不是 push 和 pop 实现, 而是添加到具体的下标, 减少运算复杂度
 */
export class Observe {
  constructor() {
    this.cbs = [];
  }

  add(cb) {
    let idx = -1;
    const len = this.cbs.length;

    for (let i = 0; i < len; i++) {
      if (!this.cbs[i]) {
        idx = i;
        break;
      }
    }
    idx = idx === -1 ? len : idx;

    this.cbs[idx] = cb;

    return idx;
  }

  // 尽量不使用 splice, 减小运算复杂度
  delete(idx) {
    this.cbs[idx] = null;
  }

  notify(...args) {
    this.cbs.forEach(cb => cb && cb(...args));
  }
}
