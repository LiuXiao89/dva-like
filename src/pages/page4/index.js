import React, {useReducer} from 'react';

import {useConnect} from 'src/dva-like';

import Comp from './comp';

const mapFunc = ({dynamic}) => ({dynamic});

const data = {
  num: 1,
};

const reducer = (state, action) => {
  console.log('self reducer');
  switch (action.type) {
    case 'increase':

      return {...state, num: state.num + 1};

    default: break;
  }
};

export default () => {
  const {dispatch, dynamic} = useConnect(mapFunc);

  const [state, dispatchReducer] = useReducer(reducer, data);


  // console.log('render other page 4, depend on dynamic', dynamic);

  return (
    <div>

      page4!;

      <button
        onClick={() => {
          dispatch({type: 'dynamic/set', payload: {count: dynamic.count + 1}});
        }}
      >
        加dynamic 的 count
      </button>

      <br />

      {dynamic.count}

      <br/>
      <br/>

      <p>自己的 reducer count: {state.num}</p>

      <button
        onClick={() => dispatchReducer({type: 'increase'})}
      >改变自己的 reducer
      </button>

      <Comp/>


    </div>
  );
};
