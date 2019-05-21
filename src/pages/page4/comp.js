import React from 'react';
import {useStore} from 'src/dva-like';


export default () => {
  const {dispatch, dynamic, home} = useStore();

  return (
    <div>


      page4 comp

      {dynamic.count}

      <br/>

      <button
        onClick={() => {
          dispatch({type: 'dynamic/set', payload: {count: dynamic.count + 1}});
        }}
      >
        加dynamic 的 count
      </button>


      <br/>
      <br/>
      <br/>

      {home.count}

      <br/>

      <button
        onClick={() => {
          dispatch({type: 'home/increase'});
        }}
      >
        加home 的 count
      </button>


    </div>
  );
};
