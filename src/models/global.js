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
    set(state, action) {
      return {...state, ...action.payload};
    },
  },

  effects: {
    async login({put}, {payload}) {
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
  },
};
