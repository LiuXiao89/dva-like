export const splitAction = (action) => {
  const {type} = action;
  const reg = /^([^/]+)\/(.*)$/;

  const result = reg.exec(type);

  return result ?
    [result[1], result[2]] : [type];
};

