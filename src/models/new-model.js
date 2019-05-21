
const model = {
  namespace: 'newModel',
  state: {
    is: true,
    more: null,
  },

  reducers: {
    set: (state, action) => ({...state, ...action.payload}),
  },
};

export default model;
