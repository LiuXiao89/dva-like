# dva-like

由dva产生的灵感, 结合 React v16.8 的 useDispatch, 产生的更轻量的, 更贴合日常项目开发的状态管理库

## 特性

- 基于 React v16.8+ 
- 可以使用 hooks 或者高阶组件 无缝连接组件
- 继承 React.lazy 的 lazyLoad 可以异步加载组件和model
- 使用了 async - await 的 effects, 逻辑上更加符合直觉

## 依赖

- 没有依赖, 目前没有 npm 包, 将文件夹复制到工程目录下食用..

## 开始使用

- 与正统 dva 语法及其相似, 除了 effects 没有使用 generator 语法之外
- 默认的, 在 reducers 内置了 set|reset 函数, 
- dispatch({type: 'namespace/set', payload: somePayload}) 来进行该命名空间内某些字段的更新
- dispatch({type: 'namespace/reset'}) 来重置命名空间

1. models 声明: 
  const globalModel = {
    namespace: 'global',

    state: {
      isFetchLogin: false,
      isLogin: false,
      userName: null,

      count: 1,
    },

    reducers: {
      logout(state) {
        return {...state, isLogin: false, userName: null};
      },
      increase(state) {
        return {...state, count: state.count + 1};
      },

    },

    effects: {
      async login({payload}, {put, call}) {
        put({type: 'set', payload: {isFetchLogin: true}});

        const resp = await new Promise((res) => {
          setTimeout(() => {
            if (user.includes(payload.user) && pwd.includes(payload.pwd)) {
              res({code: 0});
            } else {
              res({code: 1});
            }
          }, 200);
        });

        const list = await call({type: 'home/getList'});

        console.log('异步调用其他effects 完毕', list);

        const localRes = await call({type: 'getSth', payload: resp.code});

        console.log('异步调用本地effects 完毕', localRes);

        put({type: 'set', payload: {isFetchLogin: false}});

        resp.code === 0 && put({
          type: 'set',
          payload: {
            isLogin: true,
            userName: payload.user,
          },
        });

        return resp;
      },

      async getSth({payload}, {put}) {
        const resp = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(payload === 0 ? '获取完毕' : '登录失败, 不能获取');
          }, 150);
        });

        put({type: 'increase'});

        return resp;
      },
    },
  };

2. `import {model, start, store, connect, useStore, useConnect} from 'src/dva-like'`,  

3. 然后model(globalModel), 即可注册该model, 其他 model 同理

4. start(App), 将 model 挂载进应用

5. 组件内使用 useStore() 链接整个 model, 使用 useConnect(mapFunction) 链接部分model. 他们返回的数据内自带 dispatch

6. store 内置 {ctx, _store, _reducer, _dispatch} 方法. ctx 为 createContext 返回的内容, 可以使用 ctx.Consumer 来链接整个 Context(不建议); _store 为初始的数据内容; _reducer 为内部实现的reducer方法 不建议使用; _dispatch 可以在任意地方使用, 调用 reducer 或者 effect