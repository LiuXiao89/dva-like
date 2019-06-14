

/**
 * 返回当前 type 的 namespace 和 subType
 * @param {object} action 拆分他的 type
 */
export const splitAction = (action) => {
  const {type} = action;

  return splitType(type);
};

export const splitType = (type) => {
  const reg = /^([^/]+)\/(.*)$/;

  const result = reg.exec(type);

  return result ?
    [result[1], result[2]] : [type];
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

/**
 * reducer 使用 深拷贝
 * @param {object} source 源对象
 * @returns {object} target 拷贝对象
 */

export const deepClone = (source) => {
  let target;
  const type = typeof source;
  const isArray = Array.isArray(source);

  if (!source) return source;

  if (isArray) {
    target = [];

    source.forEach((item, index) => {
      target[index] = deepClone(item, null);
    });
  } else if (type === 'object') {
    target = {};

    Object.keys(source).forEach((key) => {
      target[key] = deepClone(source[key], null);
    });
  } else {
    target = source;
  }

  return target;
};
