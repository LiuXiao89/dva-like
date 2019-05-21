import React from 'react';
import {useConnect} from 'src/dva-like';

import OtherComp from '../test-components/other-comp';
import OtherComp2 from '../test-components/other-comp-2';
import OtherComp3 from '../test-components/other-comp-3';
import OtherComp4 from '../test-components/other-comp-4';


const mapFunc = ({global}) => ({global});

// 各个组件使用 use connect
// 根节点使用了 global
// 所以当子组件更改了 global 之后, 根节点会重新render, 带动其他没有依赖 global的子组件刷新
export default () => {
  const state = useConnect(mapFunc);

  console.log('render page 2', state);

  return (
    <div>

      page2!;


      <br/>

      <OtherComp/>

      <br/>

      <OtherComp2/>

      <br/>

      <OtherComp3/>

      <br/>

      <OtherComp4/>


    </div>
  );
};
