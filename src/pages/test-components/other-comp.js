import React, {useEffect} from 'react';
import {useConnect} from 'src/dva-like';
import {useRouter} from 'src/hooks/use-router';


const mapFunc = ({global}) => ({global});

export default () => {
  const {dispatch, global} = useConnect(mapFunc);
  const {history} = useRouter();

  console.log('render other comp 1', global);

  useEffect(() => {
    console.log('comp');
  }, []);

  return (
    <div>
      <p>
        {global.isLogin ? '登陆了' : '没登录'}
      </p>

      <br/>


      <button
        onClick={() => dispatch({
          type: 'global/increase',
        })}
      >
        点我加1
      </button>
      <p>global count: {global.count}</p>

      <br/>


      <button
        onClick={() => dispatch({
          type: 'global/logout',
        })}
      >
        点我退出
      </button>

      <div>
        {
          !global.isLogin &&
            <button
              onClick={() => history.push('/1')}
            >
              去第一页登录
            </button> }
      </div>


    </div>
  );
};
