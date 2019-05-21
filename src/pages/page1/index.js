import React, {useState} from 'react';
import {useStore} from 'src/dva-like';

import './style.less';

// 使用全局 store
export default () => {
  const store = useStore();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');

  const {global, dispatch} = store;
  const {isLogin, userName, isFetchLogin} = global;

  return (
    <div className={'page1'}>
      page1!;

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
              });
            }}
            >点我登录
            </button>
          </div> :
          <div>切换账号</div>
      }

    </div>
  );
};
