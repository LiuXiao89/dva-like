import React, {useContext} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
// import {setPush} from 'src/components/animate-router';

// useRouter 必须配合 context: CustomRouter 使用
const routerContext = React.createContext({});

const {Provider} = routerContext;

// 劫持history, 为了动画路由
// 在 animate-router 里面比较完美的实现了动画, 暂时不需要他了
// const mixinHistory = (props) => {
//   const mix = {...props.history};

//   const define = (key, getCb) => {
//     Object.defineProperty(mix, key, {
//       get() {
//         getCb();
//         return props.history[key];
//       },
//     });
//   };

//   define('push', () => { setPush(true); });
//   define('replace', () => { setPush(true); });
//   define('goBack', () => { setPush(false); });

//   return mix;
// };

const CustomRouter = ({children}) => {
  return (
    <BrowserRouter>
      <Route
        render={props => {
          // const history = mixinHistory(props);
          // <Provider value={{...props, history}}>
          return (
            <Provider value={props}>
              {children}
            </Provider>
          );
        }}
      />
    </BrowserRouter>
  );
};

const useRouter = () => {
  return useContext(routerContext);
};

export {useRouter, CustomRouter};
