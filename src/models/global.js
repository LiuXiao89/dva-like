const user = ['lx', 'll', 'xx'];
const pwd = ['lx', 'll', 'xx'];

export default {
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
