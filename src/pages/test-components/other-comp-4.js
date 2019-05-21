import React from 'react';
import {connect} from 'src/dva-like';

// 使用高阶组件 不推荐
const Comp4 = (props) => {
  console.log('render other comp 4', props);

  return (
    <div>

      第四个组件


      <div>
        {
          props.dynamic.count
        }
      </div>

      <br/>

      <button
        onClick={() => {
          props.dispatch({type: 'dynamic/set', payload: {count: props.dynamic.count + 1}});
        }}
      >增加 dynamic
      </button>

    </div>
  );
};

export default connect(({dynamic}) => ({dynamic}))(Comp4);
