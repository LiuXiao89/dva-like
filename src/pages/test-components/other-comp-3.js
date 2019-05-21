import React from 'react';
import {useConnect} from 'src/dva-like';

const mapFunc = ({dynamic}) => ({dynamic});

// 使用 useConnect
export default () => {
  const {dispatch, dynamic} = useConnect(mapFunc);

  console.log('render other comp 3', dynamic);

  return (
    <div>

      第三个组件

      <button
        onClick={() => {
          dispatch({type: 'dynamic/set', payload: {count: dynamic.count + 1}});
        }}
      >
        加count
      </button>

      <br />

      {dynamic.count}

    </div>
  );
};
