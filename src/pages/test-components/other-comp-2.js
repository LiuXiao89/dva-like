import React, {useEffect} from 'react';
import {useConnect} from 'src/dva-like';

const mapFunc = ({home}) => ({home});


export default () => {
  const {dispatch, home} = useConnect(mapFunc);

  console.log('render other comp 2', home);

  useEffect(() => {
    console.log('comp2');
  }, []);


  return (
    <div>

      第二个组件

      <button
        onClick={() => {
          dispatch({type: 'home/increase'});
        }}
      >
        加count
      </button>

      <br/>

      {home.count}

    </div>
  );
};
