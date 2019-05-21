
const model = {
  namespace: 'dynamic',
  state: {
    dynamic: true,
    count: 1,
  },
  reducers: {
    set: (state, action) => {
      console.log('dynamic set');
      return ({...state, ...action.payload});
    },
    add: state => {
      console.log('dynamic add');
      return ({...state, count: state.count + 1});
    },
  },
};

export default model;
