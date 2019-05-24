import React from 'react';
import ReactDOM from 'react-dom';
import Layout from 'src/layout';

import {CustomRouter} from 'src/hooks/use-router';

import {model, start} from 'src/dva-like';
import models from 'src/models';

models.forEach(item => model(item));

const App = () => (
  <CustomRouter>
    <Layout />
  </CustomRouter>
);

const Main = start(App);

ReactDOM.render(
  <Main/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// import * as serviceWorker from '../serviceWorker';
// serviceWorker.unregister();
