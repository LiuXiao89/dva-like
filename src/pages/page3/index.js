import React, {useEffect} from 'react';

import {useConnect} from 'src/dva-like';

import OtherComp from '../test-components/other-comp';

const map = ({home}) => ({home});

export default () => {
  const {home, dispatch} = useConnect(map);


  const {list, isFetching} = home;

  useEffect(() => {
    console.log('page3');
  }, []);


  return (
    <div>

      page3!;


      <br/>

      <button
        onClick={() => {
          const res = dispatch({type: 'home/getList'});

          res.then(r => console.log(r));
        }}
      >拉列表
      </button>

      <div>
        {isFetching ? '拉列表' : '没拉'}
      </div>

      <ul>
        {
          list.map((item) => (
            <li key={item}>{item}</li>
          ))
        }
      </ul>

      <OtherComp/>


    </div>
  );
};
