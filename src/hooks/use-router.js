import React, {useContext} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

// useRouter 必须配合 context: CustomRouter 使用
const routerContext = React.createContext({});

const {Provider} = routerContext;

const CustomRouter = ({children}) => {
  return (
    <BrowserRouter>
      <Route
        render={p => (
          <Provider value={p}>
            {children}
          </Provider>
        )}
      />
    </BrowserRouter>
  );
};

const useRouter = () => {
  return useContext(routerContext);
};

export {useRouter, CustomRouter};
