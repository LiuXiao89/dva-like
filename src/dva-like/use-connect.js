import {useEffect, useState} from 'react';
import {content} from './content';
import {store} from './reducers';
import {Observe} from './utils';


// 通知useConnect更新,
// 注意: observe 不一定是 '充满的', 需要跳过 null 部分
const connectObserver = new Observe();

// 使用本地维护的 store 来进行数据连接
// 如果使用 reducer, 那么需要连接全局store... 就白连接了
// (因为使用了 context 那就会触发所有子组件重新 render)
const useConnect = (mapFunction) => {
  const partialStore = mapFunction(store);
  const [partial, setPartial] = useState(partialStore);

  useEffect(() => {
    let prevPartial = partial;

    const cb = (nextState) => {
      const nextPartial = mapFunction(nextState);

      let needRefresh = false;

      const keys = Object.keys(nextPartial);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (nextPartial[key] !== prevPartial[key]) {
          needRefresh = true;
          break;
        }
      }

      if (needRefresh) {
        prevPartial = nextPartial;
        setPartial(nextPartial);
      }
    };

    const idx = connectObserver.add(cb);

    return () => { connectObserver.delete(idx); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {...partial, dispatch: content.dispatch};
};

export {connectObserver};

export default useConnect;
