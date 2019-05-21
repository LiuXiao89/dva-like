import React, {useContext, useMemo} from 'react';
import {content} from './content';

const connect = mapFunction => Child => props => (
  <RenderChild
    Child={Child}
    props={props}
    mapFunction={mapFunction}
  />
);

const RenderChild = ({props, mapFunction, Child}) => {
  const store = useContext(content.globalContext);

  const mapStore = mapFunction(store);

  const memoDep = [];

  Object.keys(mapStore).forEach(key => memoDep.push(mapStore[key]));

  return useMemo(
    () => (
      <Child
        {...props}
        {...mapStore}
        dispatch={store.dispatch}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...memoDep, props, store.dispatch]
  );
};


export {connect};

