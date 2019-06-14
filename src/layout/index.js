import React from 'react';
import {Route} from 'react-router-dom';
import {useRouter} from 'src/hooks/use-router';
import Animate from 'src/components/animate-router';

import {Page1, Page2, Page3, Page4} from 'src/router/page-map-async';

import './style.less';

// layout
const Layout = () => {
  const {history} = useRouter();


  return (
    <div className={'main-layout'}>

      <header>
        <p>
          <button
            onClick={() => history.goBack()}
          >点击返回
          </button>
          <br/>
          首页头部

        </p>

        <menu>
          <ul>
            {
              [1, 2, 3, 4].map(item => (
                <li
                  key={item}
                  onClick={() => history.push(`/${item}`)}
                >
                  跳转第{item}页
                </li>
              ))
            }
          </ul>
        </menu>
      </header>

      <div className={'page'}>
        <Animate>
          <Route path={'/1'} key={1} exact render={(p) => <Page1 {...p} />} />
          <Route path={'/2'} key={2} exact render={(p) => <Page2 {...p} />} />
          <Route path={'/3'} key={3} exact render={(p) => <Page3 {...p} />} />
          <Route path={'/4'} key={4} exact render={(p) => <Page4 {...p} />} />
        </Animate>
      </div>
    </div >


  );
};

export default Layout;

