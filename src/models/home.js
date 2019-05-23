/* eslint-disable no-unused-vars */

const model = {
  namespace: 'home',
  state: {
    color: 'red',
    count: 1,

    list: [],
    isFetching: false,
  },

  reducers: {
    increase: (state, action) => {
      return ({...state, count: state.count + 1});
    },
    changeColor: (state, action) => ({...state, color: state.color === 'red' ? 'blue' : 'red'}),
    toggleFetch: (state, action) => ({...state, isFetching: !state.isFetching}),
    set: (state, action) => {
      return ({...state, ...action.payload});
    },
  },

  effects: {
    async getList({put}, action) {
      put({type: 'set', payload: {isFetching: true}});

      const r = await new Promise((res, rej) => {
        setTimeout(() => {
          const resp = {
            code: 0,
            data: [1, 2, 3, 4],
          };

          put({
            type: 'set',
            payload: {list: resp.data},
          });

          rej(resp);
        }, 1000);
      });

      put({type: 'set', payload: {isFetching: false}});


      return r;
    },
  },
};

export default model;

