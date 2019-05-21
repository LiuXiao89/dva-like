import {useEffect, useState} from 'react';
import {content} from './content';
import {store} from './reducers';

const observe = [];

const notifyConnects = (nextState) => {
  observe.forEach((cb) => cb(nextState));
};

const useConnect = (mapFunction) => {
  const partialStore = mapFunction(store);
  const [partial, setPartial] = useState(partialStore);


  useEffect(() => {
    const idx = observe.length;

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

    observe[idx] = cb;

    return () => {
      const removeIdx = observe.findIndex(i => i === cb);
      observe.splice(removeIdx, 1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {...partial, dispatch: content.dispatch};
};

export {notifyConnects};

export default useConnect;
