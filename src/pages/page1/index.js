import React, {useState} from 'react';
import {useStore} from 'src/dva-like';

import './style.less';

// 使用全局 store
// 但是只使用了 global
// 可以观察 dynamic model 的注册情况..
export default () => {
  const store = useStore();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');

  const {global, dispatch, dynamic} = store;
  const {isLogin, userName, isFetchLogin} = global;


  return (
    <div className={'page1'}>
      page1!;

      <br/>

      <button
        onClick={() => dispatch({
          type: 'dynamic/add',
        })}
      >点击, 尝试触发 dynamic 的 dispatch
      </button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        dynamic 是否注册? {dynamic ? `注册了: count: ${dynamic.count}` : '没有注册'}

      <br/>

      登录的同时会触发 [home model](另外的model) 拉列表的操作

      <br/>
      以及 [global model](本地model) 获取其他数据的操作

      <br/>
      还有 [global model](本地model) 数量加1操作

      <br/>

      <br/>

      {isFetchLogin && <div className={'shadow'} />}

      {
        isLogin &&
        <p>已登录, 登录人: {userName}</p>
      }

      {
        !isLogin ?
          <div>
            用户名:
            <input type="text" value={user} onChange={e => setUser(e.target.value)}/>
            <br />

            密码:
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}/>
            <br />

            <button onClick={() => {
              dispatch({
                type: 'global/login',
                payload: {user, pwd},
              }).then(loginRes => {
                console.log('登录结果', loginRes);
              });
            }}
            >点我登录
            </button>
          </div> :
          <div>切换账号</div>
      }

      <br/>

      global count: {global.count}

    </div>
  );
};
