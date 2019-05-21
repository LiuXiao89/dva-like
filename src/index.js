import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import {CustomRouter} from './hooks/use-router';

import {model, start} from './dva-like';
import models from './models';

models.forEach(item => model(item));

const Main = start(() => (
  <CustomRouter>
    <App />
  </CustomRouter>
));


ReactDOM.render(
  <Main/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// import * as serviceWorker from '../serviceWorker';
// serviceWorker.unregister();
