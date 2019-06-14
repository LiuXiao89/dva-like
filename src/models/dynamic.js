
const model = {
  namespace: 'dynamic',
  state: {
    dynamic: true,
    count: 1,
  },
  reducers: {

    add(state) {
      return ({...state, count: state.count + 1});
    },
  },
};

export default model;
