import React from 'react';
import {Route} from 'react-router-dom';
import {useRouter} from './hooks/use-router';
import Animate from './components/animate-router';

import Page1 from './pages/page1';
import Page2 from './pages/page2';
import Page3 from './pages/page3';
import Page4 from './pages/page4';

import './app.less';

// layout
const App = () => {
  const {history} = useRouter();


  return (
    <div className={'main-layout'}>

      <header>
        <p>首页头部</p>
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

          <Route path={'/1'} key={1} exact component={Page1}/>
          <Route path={'/2'} key={1} exact component={Page2} />
          <Route path={'/3'} key={1} exact component={Page3} />
          <Route path={'/4'} key={1} exact component={Page4} />

        </Animate>

      </div>
    </div>


  );
};

export default App;

